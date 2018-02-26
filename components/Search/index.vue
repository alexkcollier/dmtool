<template>
  <div>
    <!-- Search box -->
    <b-field>
      <div class="control is-expanded">
        <b-autocomplete
          icon="magnify"
          v-model="searchTerm"
          @select="query"
          :field="searchField"
          :data="queryResult"
          :placeholder="placeholder"
          keep-first/>
      </div>
      <div class="control">
        <button
          class="button is-primary"
          style="margin:0;"
          :disabled="!searchTerm" 
          @click="clearSearch">
          Clear
        </button>
      </div>
    </b-field>

    <!-- Filters -->
    <div v-if="filterFields.length" class="card">
      <div class="card-header">

        <!-- Filter collapse control-->
        <a @click="filterViewToggle()" class="card-header-title">
          Filters
          <b-icon :icon="collapseFilters ? 'chevron-down' : 'chevron-up'"/>
        </a>
      </div>

      <!-- Filter options display -->
      <transition name="fade-grow">
        <div v-show="!collapseFilters">
          
          <!-- Filter options select -->
          <div class="card-header">
            <template v-for="(data, filter) in filters">
              <a 
                class="card-footer-item is-capitalized"
                :key="filter"
                :class="{'is-active': visibleFilterOptions === filter}"
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
                class="control"
                :key="option.name">
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
      <div class="help has-text-right" :class="{'is-danger': resultCount == 0}">
        {{ resultCount }} {{ searchType }}<span v-if="resultCount != 1">s</span> found.
      </div>
    </div>

    <hr>
  </div>
</template>

<script>
import _ from 'lodash'

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
      scrollPos: 0,
      prevScroll: 0,
      count: 10
    }
  },

  computed: {
    placeholder() {
      return this.searchType ? `Search for ${this.searchType}s` : 'Search'
    },
    filters: function() {
      return this.getFilters(...this.filterFields)
    },
    visibleFilterOptions() {
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
  },

  destroyed() {
    if (typeof window !== 'undefined')
      window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
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
    filterTest: function(filter, testValue) {
      return this.filters[filter]
        .reduce((valid, option) => {
          if (option.value) valid.push(option.name)
          return valid
        }, [])
        .includes(testValue) // return if true if filter contains testValue
    },
    getFilters: function(...filters) {
      // Generate filter lists from data
      return filters.reduce((obj, filter) => {
        let options = [...new Set(this.model.map(item => item[filter]))].reduce(
          (arr, option) => {
            if (typeof option !== 'undefined')
              arr.push({ name: option, value: true })
            return arr
          },
          []
        ) // Create array of filter options from model
        if (this.filtersToSort.includes(filter)) {
          options = _.sortBy(
            options,
            o => (typeof o.name === 'number' ? Number(o.name) : String(o.name))
          ) // sort
        }
        obj[filter] = options
        return obj
      }, {})
    },
    query: _.debounce(function() {
      const result = this.model.filter(
        el =>
          // TODO: increase fuzziness of search (i.e.: includes(['search', 'Term']) rather than includes('searchTerm'))
          el[this.searchField]
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) &&
          Object.keys(this.filters).reduce(
            (testRes, filter) => testRes * this.filterTest(filter, el[filter]), // check each element against all filters
            1
          ) // ensure element contains search term and passes filter test
      )

      this.$root.$emit('toggle')
      this.queryResult = _.sortBy(result, 'name')
      this.emitUpdateData()
    }, 300),
    loadMore: function(n = 10) {
      this.count += n
    },
    loadFewer: function(n = 10) {
      this.count = this.count - n >= 10 ? this.count - n : 10 // Count never < 10
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
      if (scrollDir < 0) {
        if (offset === height) {
          this.loadMore()
          this.scrollPos = offset
        }
      } else {
        // TODO: Better remove items performance
        if (this.scrollPos >= offset) {
          const m =
            this.queryResult.length % 10 === 0
              ? 0
              : this.queryResult.length -
                Math.floor(this.queryResult.length / 10) * 10
          const x = Math.floor(this.scrollPos / offset) * 5 + m
          this.loadFewer(x)
          this.scrollPos = offset - window.innerHeight * 2
        }
      }
      this.prevScroll = d.scrollTop
      this.emitUpdateData()
    }, 200)
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
</style>
