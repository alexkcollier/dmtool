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
          @input="debounceQuery"/>
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
          <b-icon :class="{'point-up': !collapseFilters}" icon="chevron-down" class="icon-point"/>
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
                :class="{'is-active': filter === visibleFilter}"
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
                @click="setAllOptions(visibleFilter, true)">
                Enable all
              </a>
              <a
                class="control button button-grouped"
                style="margin-left:0;"
                @click="setAllOptions(visibleFilter, false)">
                Disable all
              </a>
            </b-field>
            <b-field grouped group-multiline>
              <div
                v-for="(option, index) in filters[visibleFilter]"
                :key="index"
                class="control">
                <b-switch v-model="option.allowed" @input="debounceQuery">
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
      <div :class="{'is-danger': resultCount === 0}" class="help has-text-right">
        {{ resultCount }} {{ searchType }}<span v-if="searchType && resultCount !== 1">s</span> found.
      </div>
    </div>

    <hr>
  </div>
</template>

<script>
import { debounce, sortBy, throttle } from 'lodash'
import { mapActions } from 'vuex'

export default {
  name: 'Search',

  filters: {
    parseNumToFrac(num) {
      return typeof num === 'number' && num > 0 && num < 1
        ? `1/${1 / num}` // converts decimal to denominator
        : num
    },

    formatFilterOptionName(str) {
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
      default: 'name'
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
      // searchTerm: '',
      queryResult: sortBy(this.model, this.searchField),
      collapseFilters: true,
      visibleFilter: '',
      filters: {},
      prevScroll: 0,
      count: 10
    }
  },

  computed: {
    searchTerm: {
      get() {
        return this.$store.state[this.$route.params.slug].searchString
      },
      set(value) {
        this.$store.commit(
          `${this.$route.params.slug}/UPDATE_SEARCH_STRING`,
          value
        )
      }
    },
    cleanSearchTerm() {
      return this.searchTerm.toLowerCase().trim()
    },

    placeholder() {
      return this.searchType ? `Search for ${this.searchType}s` : 'Search'
    },

    resultCount() {
      return this.queryResult.length
    },

    updateDataPayload() {
      return {
        truncated: this.queryResult.slice(0, this.count),
        show: this.queryResult.length > 0
      }
    }
  },

  watch: {
    count() {
      this.$emit('update-data', this.updateDataPayload)
    },

    queryResult() {
      this.$emit('update-data', this.updateDataPayload)
    }
  },

  created() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll)
    }

    if (this.$route.query.name) this.searchTerm = this.$route.query.name

    this.query()
    this.generateFilters()
  },

  mounted() {
    this.visibleFilter = Object.keys(this.filters)[0]
  },

  destroyed() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },

  methods: {
    ...mapActions('toggle-active-el', {
      clearActiveEl: 'CLEAR_ACTIVE_EL'
    }),
    debounce,

    filterViewToggle() {
      this.collapseFilters = !this.collapseFilters
    },

    generateFilters() {
      this.filterFields.map(filter => {
        let options = this.setFilterOptions(filter)
        this.$set(this.filters, filter, this.sortFilterOptions(filter, options))
      })
    },

    setFilterOptions(filter) {
      return this.getUniqueValues(filter).map(val => ({
        name: val,
        allowed: true
      }))
    },

    getUniqueValues(key) {
      return [...new Set(this.model.map(el => el[key][key] || el[key]))]
    },

    sortFilterOptions(f, o) {
      const sortFn = ({ name }) => {
        if (isNaN(name)) {
          if (name.match(/\d\/\d/)) return name[0] / name[2]
          if (name === 'Unknown') return Number(name)

          return name
        }

        return Number(name)
      }

      return this.filtersToSort.includes(f) ? sortBy(o, sortFn) : o
    },

    resetFilters() {
      Object.keys(this.filters).map(filter => this.setAllOptions(filter, true))
    },

    setAllOptions(filter, allowed) {
      this.filters[filter].forEach(option => (option.allowed = allowed))
    },

    clearSearch() {
      this.searchTerm = ''
      this.query()
    },

    // TODO: increase fuzziness of search (i.e.: includes(['search', 'Term']) rather than includes('searchTerm'))
    query() {
      this.clearActiveEl()
      this.queryResult = sortBy(
        this.searchAndFilter(this.model),
        this.searchField
      )
    },

    debounceQuery: debounce(function() {
      this.query()
    }, 300),

    searchAndFilter(arr) {
      return arr.filter(el => this.includesTerm(el) && this.passesFilters(el))
    },

    includesTerm(el) {
      const testVal = el[this.searchField].toLowerCase().trim()
      return testVal.includes(this.cleanSearchTerm)
    },

    passesFilters(el) {
      return Object.keys(this.filters).every(f =>
        this.filters[f]
          .filter(({ allowed }) => allowed)
          .map(({ name }) => name)
          .includes(el[f][f] || el[f])
      )
    },

    handleScroll: throttle(function(event) {
      const { offsetHeight, scrollTop } = document.documentElement
      const scrollDistance = scrollTop + window.innerHeight
      const atBottom = scrollDistance >= offsetHeight - 300
      const showingCount = this.updateDataPayload.truncated.length
      const hiddenResults = showingCount < this.resultCount

      if (atBottom && hiddenResults) this.loadMore()

      this.prevScroll = scrollTop
    }, 50),

    loadMore() {
      this.count += 1
    }
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
