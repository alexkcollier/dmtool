<template>
  <div>
    <!-- Search box -->
    <b-field>
      <div class="control is-expanded">
        <b-input
          v-model="searchTerm" 
          :class="{'is-danger': !queryResult.length }"
          :placeholder="placeholder"
          icon="magnify"
          type="text"
          @input="query"/>
      </div>
      <div class="control">
        <button
          :disabled="!searchTerm" 
          class="button is-primary"
          style="margin:0;"
          @click="clearSearch">
          Clear
        </button>
      </div>
    </b-field>

    <!-- Filters -->
    <div v-if="filterFields.length" class="card">
      <div class="card-header">

        <!-- Filter collapse control-->
        <a class="card-header-title" @click="filterViewToggle">
          <b-icon
            icon="filter"
            size="is-small"
            style="margin-right:0.25rem;"
            type="is-dark"/>
          Filters
          <!-- <b-icon :icon="collapseFilters ? 'chevron-down' : 'chevron-up'"/> -->
          <b-icon icon="chevron-down" :class="{'point-up': !collapseFilters}" class="icon-point"/>
        </a>

        <!-- Reset filters -->
        <a class="button is-text" @click="resetFilters">Reset filters</a>
      </div>

      <!-- Filter options display -->
      <transition name="fade-grow">
        <div v-show="!collapseFilters">
          
          <!-- Filter options select -->
          <div class="card-header">
            <template v-for="(data, filter) in filters">
              <a 
                :key="filter"
                :class="{'is-active': visibleFilterOptions === filter}"
                class="card-footer-item is-capitalized"
                @click="visibleFilter = filter">
                {{ filter | formatFilterOptionName }}
              </a>
            </template>
          </div>

          <!-- Filter options -->
          <!-- TODO: improve display -->
          <div class="card-content">
            <b-field grouped group-multiline>
              <a
                class="control button button-grouped"
                style="margin-left:0;"
                @click="setAllFilterOptions(visibleFilter, true)">
                Enable all
              </a>
              <a
                class="control button button-grouped"
                style="margin-left:0;"
                @click="setAllFilterOptions(visibleFilter, false)">
                Disable all
              </a>
            </b-field>
            <b-field grouped group-multiline>
              <div
                v-for="option in filters[visibleFilterOptions]"
                :key="option.name"
                class="control">
                <b-switch v-model="option.value" @input="query">
                  {{ option.name | parseNumToFrac }}
                </b-switch>
              </div>
            </b-field>
          </div>

        </div>
      </transition>
    </div>

    <!-- Result count -->
    <div class="control">
      <div :class="{'is-danger': resultCount == 0}" class="help has-text-right">
        {{ resultCount }} {{ searchType }}<span v-if="resultCount != 1">s</span> found.
      </div>
    </div>

    <hr>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapActions } from 'vuex'

export default {
  name: 'Search',

  filters: {
    parseNumToFrac: function(num) {
      return typeof num === 'number' && num > 0 && num < 1
        ? `1/${1 / num}`
        : num
    },
    formatFilterOptionName: function(str) {
      return str.length <= 2 ? str.toUpperCase() : str
    }
  },

  props: {
    model: {
      type: Array,
      default: () => []
    },
    searchField: {
      type: String,
      default: ''
    },
    searchType: {
      type: String,
      default: ''
    },
    filtersToSort: {
      type: Array,
      default: () => []
    },
    filterFields: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      searchTerm: '',
      queryResult: _.sortBy(this.model, 'name'),
      collapseFilters: true,
      visibleFilter: '',
      filters: {},
      scrollPos: 0,
      prevScroll: 0,
      count: 10
    }
  },

  computed: {
    placeholder: function() {
      return this.searchType ? `Search for ${this.searchType}s` : 'Search'
    },
    visibleFilterOptions: function() {
      return this.visibleFilter
        ? this.visibleFilter
        : Object.keys(this.filters) ? Object.keys(this.filters)[0] : ''
    },
    resultCount: function() {
      return this.queryResult.length
    }
  },

  created() {
    if (typeof window !== 'undefined')
      window.addEventListener('scroll', this.handleScroll)
    if (this.$route.query.name) this.searchTerm = this.$route.query.name
    this.query()
    this.getFilters(...this.filterFields)
  },

  destroyed() {
    if (typeof window !== 'undefined')
      window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    ...mapActions('toggle-active-el', { clearActiveEl: 'CLEAR_ACTIVE_EL' }),
    clearSearch: function() {
      this.searchTerm = ''
      this.query()
    },
    filterViewToggle: function() {
      if (!this.visibleFilter) this.visibleFilter = Object.keys(this.filters)[0]
      this.collapseFilters = !this.collapseFilters
    },
    setAllFilterOptions: function(filter, val) {
      this.filters[filter].forEach(option => {
        option.value = val
      })
    },
    resetFilters: function() {
      Object.keys(this.filters).map(filter =>
        this.setAllFilterOptions(filter, true)
      )
    },
    filterTest: function(filter, testValue) {
      return this.filters[filter]
        .reduce((valid, option) => {
          if (option.value) valid.push(option.name)
          return valid
        }, [])
        .includes(testValue) // return if true if filter contains testValue
    },
    getFilters: function(...filters) {
      // Iterate over provided filters
      filters.map(filter => {
        // Generate filter options from model
        let options = [...new Set(this.model.map(item => item[filter]))].reduce(
          (arr, option) => {
            if (typeof option !== 'undefined')
              arr.push({ name: option, value: true })
            return arr
          },
          []
        )
        if (this.filtersToSort.includes(filter)) {
          options = _.sortBy(
            options,
            o => (typeof o.name === 'number' ? Number(o.name) : String(o.name))
          ) // sort
        }
        this.$set(this.filters, filter, options) // Set filter options. Must use vm.set to make this.filters reactive.
      })
    },
    toLowerCaseTrim: function(str) {
      return _.trim(str.toLowerCase())
    },
    query: _.debounce(function() {
      this.clearActiveEl()
      const result = this.model.filter(
        el =>
          // TODO: increase fuzziness of search (i.e.: includes(['search', 'Term']) rather than includes('searchTerm'))
          this.toLowerCaseTrim(el[this.searchField]).includes(
            this.toLowerCaseTrim(this.searchTerm)
          ) &&
          Object.keys(this.filters).reduce(
            (testRes, filter) => testRes * this.filterTest(filter, el[filter]), // check each element against all filters
            1
          ) // ensure element contains search term and passes filter test
      )

      this.queryResult = _.sortBy(result, 'name')
      this.emitUpdateData()
    }, 300),
    loadMore: function(n = 10) {
      this.count += n
    },
    emitUpdateData: function() {
      this.$emit('update-data', {
        truncated: this.queryResult.slice(0, this.count),
        show: this.queryResult.length > 0
      })
    },
    handleScroll: _.throttle(function(event) {
      const d = document.documentElement
      const offset = d.scrollTop + window.innerHeight // Distance scrolled and viewport height
      const height = d.offsetHeight // Total CSS height
      const scrollDir = this.prevScroll - d.scrollTop // scrollDir < 0 = scrolled down
      if (scrollDir < 0 && offset >= height - 300) {
        this.loadMore(1)
        this.scrollPos = offset
        this.emitUpdateData()
      }
      this.prevScroll = d.scrollTop
    }, 50)
  }
}
</script>

<style lang="scss" scoped>
.card {
  border-radius: 2px;
  box-shadow: none;
  &-header {
    .is-active {
      font-weight: 600;
    }
    &-title {
      padding: 0.36em 0.75em;
    }
  }

  &-footer-item {
    padding: 0.75em;
  }

  &-content {
    padding-bottom: 1.25em;
  }
}

hr {
  margin-top: 0.25em;
}

$icon-transition: transform 200ms ease-in-out;
.icon-point {
  transition: $icon-transition;
}
.point-up {
  transform: rotateZ(-180deg);
  transition: $icon-transition;
}
</style>
