<template>
  <div>
    <!-- Search box -->
    <b-field class="is-fixed-mobile">

      <div class="control is-expanded">
        <b-input
          v-model="searchTerm" 
          :class="{'is-danger': !queryResult.length }"
          :placeholder="placeholder"
          icon="magnify"
          type="text"
          @input="debounceQuery"
        />
      </div>

      <div class="control">
        <button
          :disabled="!searchTerm" 
          class="clear-button button is-primary"
          style="margin:0;"
          @click="clearSearch"
        >
          Clear
        </button>
      </div>
    </b-field>

    <!-- Filters -->
    <div v-if="filterFields.length" class="card">
      <div class="card-header">

        <!-- Filter collapse control-->
        <a class="card-header-title" href="#" @click="toggleFilterView">
          <b-icon
            icon="filter"
            size="is-small"
            style="margin-right:0.25rem;"
            type="is-dark"
          />
          
          Filters
          
          <b-icon
            :class="{'point-up': !collapseFilters}"
            icon="chevron-down"
            class="icon-point"
          />
        </a>

        <!-- Reset filters -->
        <button
          v-show="hasFilterApplied"
          class="button is-text"
          @click="resetFilters"
        >
          Reset filters
        </button>
      </div>

      <!-- Filter options display -->
      <transition name="fade-grow">
        <div v-show="!collapseFilters">
          
          <!-- Filter options select -->
          <div class="card-header">
            <a
              v-for="(data, filter) in filters"
              :key="filter"
              :class="{'is-active': filter === visibleFilter}"
              class="card-footer-item is-capitalized"
              href="#"
              @click="visibleFilter = filter"
            >
              {{ filter | formatFilterOptionName }}
            </a>
          </div>

          <!-- Filter options -->
          <!-- TODO: improve display -->
          <div 
            v-for="(filterOptions, filter) in filters"
            v-show="visibleFilter === filter"
            :key="filter"
            class="card-content"
          >

            <b-field grouped>
              <div class="control">
                <button
                  class="control button"
                  style="margin-left:0;"
                  @click="setAllOptions(filter, true)"
                >
                  Enable all
                </button>
              </div>

              <div class="control">
                <button
                  class="control button"
                  @click="setAllOptions(filter, false)"
                >
                  Disable all
                </button>
              </div>
            </b-field>
            
            <b-field grouped group-multiline>
              <div
                v-for="(option, index) in filterOptions"
                :key="index"
                class="control"
              >

                <b-switch :value="option.allowed" @input="filterResults(filter, index, $event)">
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
      <div :class="{'is-danger': !resultCount}" class="help has-text-right">
        <template v-if="resultCount === model.length">
          {{ model.length }} {{ searchType }}s.
        </template>
        <template v-else>
          {{ resultCount }} of {{ model.length }} {{ searchType }}s match.
        </template>
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
      queryResult: sortBy(this.model, this.searchField),
      collapseFilters: true,
      visibleFilter: '',
      prevScroll: 0,
      count: 10
    }
  },

  computed: {
    searchTerm: {
      get() {
        return this.$store.state[this.slug].searchString
      },
      set(value) {
        this.$store.commit(`${this.slug}/UPDATE_SEARCH_STRING`, value)
      }
    },

    hasFilterApplied() {
      return this.$store.getters[`${this.slug}/hasFilterApplied`]
    },

    filters() {
      return this.$store.state[this.slug].filters
    },

    slug() {
      return this.$route.params.slug
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

  created() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll)
    }

    if (this.$route.query.name) this.searchTerm = this.$route.query.name

    this.query()

    const noFilters = !Object.keys(this.filters).length

    if (noFilters) this.initFilters()

    this.visibleFilter = Object.keys(this.filters)[0]
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    ...mapActions('toggle-active-el', {
      clearActiveEl: 'CLEAR_ACTIVE_EL'
    }),

    toggleFilterView() {
      this.collapseFilters = !this.collapseFilters
    },

    initFilters() {
      return new Promise(() => {
        this.filterFields.map(filter => {
          const initOptions = this.initFilterOptions(filter)
          const options = this.sortFilterOptions(filter, initOptions)
          this.$store.commit(`${this.slug}/INIT_FILTER`, { filter, options })
        })
      })
    },

    initFilterOptions(filter, allowed = true) {
      return this.getUniqueValues(filter).map(name => ({ name, allowed }))
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
      this.filters[filter].map((o, i) => this.filterResults(filter, i, allowed))
    },

    filterResults(filter, optionIndex, value) {
      const payload = { filter, optionIndex, value }
      this.$store.commit(`${this.slug}/UPDATE_FILTER`, payload)
      this.debounceQuery()
    },

    clearSearch() {
      this.searchTerm = ''
    },

    // TODO: increase fuzziness of search (i.e.: includes(['search', 'Term']) rather than includes('searchTerm'))
    query() {
      this.clearActiveEl()
      this.queryResult = sortBy(
        this.searchAndFilter(this.model),
        this.searchField
      )
      this.$emit('update-data', this.updateDataPayload)
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
      this.$emit('update-data', this.updateDataPayload)
    }
  }
}
</script>

<style lang="scss" scoped>
.is-fixed-mobile {
  @media screen and (max-width: 1023px) {
    .button,
    .input,
    .control {
      border-radius: 0 !important;
    }

    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05), 0 1px 10px 0 rgba(0, 0, 0, 0.1);
    left: 0;
    margin: 0 auto;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 30;
  }
}

.clear-button {
  &.is-primary {
    &:disabled {
      background-color: rgb(145, 154, 155);
      opacity: 1;
    }
  }
}

.card {
  border-radius: 2px;
  box-shadow: none;

  &-header {
    .is-active {
      font-weight: 600;
    }
  }

  &-footer-item {
    padding: 0.75em;
  }

  &-content {
    padding-bottom: 1.25em;
  }
}

.button {
  &.is-text {
    &:hover {
      background: 0;
    }
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
