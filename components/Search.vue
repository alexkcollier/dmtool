<template>
  <div>
    <!-- Search box -->
    <b-field class="is-fixed-mobile">

      <div class="control is-expanded">
        <b-input
          id="search-box"
          v-model="searchTerm"
          autocomplete="off"
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
        <a class="card-header-title" href="#" @click.prevent="toggleFilterView">
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
              @click.prevent="visibleFilter = filter"
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
import { debounce, sortBy } from 'lodash'
import Fuse from 'fuse.js'

export default {
  name: 'Search',

  filters: {
    // converts decimal to denominator
    parseNumToFrac: num => (typeof num === 'number' && num > 0 && num < 1 ? `1/${1 / num}` : num),
    formatFilterOptionName: str => (str.length <= 2 ? str.toUpperCase() : str)
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
      fuseConfig: {
        shouldSort: true,
        threshold: 0.25,
        location: 0,
        distance: 100,
        tokenize: true,
        matchAllTokens: true,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [this.searchField]
      }
    }
  },

  computed: {
    searchTerm: {
      get() {
        return this.$store.state[this.slug].searchString
      },
      set(value) {
        this.$store.commit(`${this.slug}/UPDATE_SEARCH_STRING`, this.cleanSearchTerm(value))
      }
    },

    FuseIndex() {
      return new Fuse(this.model, this.fuseConfig)
    },

    hasFilterApplied() {
      return this.$store.getters[`${this.slug}/hasFilterApplied`]
    },

    filters() {
      return this.$store.state[this.slug].filters
    },

    filterNames() {
      return Object.keys(this.filters)
    },

    slug() {
      return this.$route.params.slug
    },

    placeholder() {
      return this.searchType ? `Search for ${this.searchType}s` : 'Search'
    },

    resultCount() {
      return this.queryResult.length
    }
  },

  watch: {
    '$route.query.name'() {
      this.searchTerm = this.$route.query.name
      this.query()
    }
  },

  mounted() {
    if (this.$route.query.name) this.searchTerm = this.$route.query.name
    if (!this.filterNames.length) this.initFilters()
    this.query()
    this.visibleFilter = this.filterNames[0]
  },

  methods: {
    cleanSearchTerm(value) {
      return value.toLowerCase().trim() || ''
    },

    toggleFilterView() {
      this.collapseFilters = !this.collapseFilters
    },

    initFilters() {
      this.filterFields.map(filter => {
        const initOptions = this.getUniqueValues(filter).map(name => ({ name, allowed: true }))
        const options = this.sortFilterOptions(filter, initOptions)
        this.$store.commit(`${this.slug}/INIT_FILTER`, { filter, options })
      })
    },

    getUniqueValues(filterName) {
      const isClass = filterName === 'class'
      const values = this.model.reduce((acc, el) => {
        // `el.class` never exists, but we want a pretty filter name
        if (isClass) return acc.concat(el.classes.fromClassList.map(cl => cl.name))
        // Allows key to not exist on every element in model
        if (!el.hasOwnProperty(filterName)) return acc
        return acc.concat(el[filterName][filterName] || el[filterName])
      }, [])

      return [...new Set(values)]
    },

    sortFilterOptions(filterName, options) {
      return this.filtersToSort.includes(filterName) ? sortBy(options, this.filterSortFn) : options
    },

    filterSortFn({ name }) {
      if (isNaN(name)) {
        if (name.match(/\d\/\d/)) return name[0] / name[2]
        if (name === 'Unknown') return Number(name)
        return name
      }

      return Number(name)
    },

    resetFilters() {
      this.filterNames.map(filterName => this.setAllOptions(filterName, true))
    },

    setAllOptions(filterName, value) {
      this.filters[filterName].map((o, index) => this.filterResults(filterName, index, value))
    },

    filterResults(filter, optionIndex, value) {
      const payload = { filter, optionIndex, value }
      this.$store.commit(`${this.slug}/UPDATE_FILTER`, payload)
      this.debounceQuery()
    },

    clearSearch() {
      this.searchTerm = ''
      if (this.$router.query.name) this.$router.push({ query: null })
    },

    query() {
      this.searchAndFilter()
      this.$emit('update-data', this.queryResult)
    },

    debounceQuery: debounce(function() {
      this.query()
    }, 300),

    searchAndFilter(str = this.searchTerm) {
      // fuzzy search; fall back to explicit search if pattern > 32
      const { fuseConfig, FuseIndex, model, searchField, passesFilters, includesTerm } = this
      const validStr = str && str.length < fuseConfig.maxPatternLength
      const res = validStr ? FuseIndex.search(str) : sortBy(model, searchField).filter(includesTerm)
      this.queryResult = res.filter(passesFilters)
    },

    includesTerm(el) {
      const testVal = el[this.searchField].toLowerCase().trim()
      return testVal.includes(this.searchTerm)
    },

    passesFilters(el) {
      return this.filterNames.every(filterName => {
        if (this.filters[filterName].every(option => option.allowed)) return true
        const getTestValues = (test, option) => (option.allowed ? test.concat(option.name) : test)
        const isClass = filterName === 'class'
        // spells use 'classes' rather than 'class' as the key; `el.class` never exists
        if (!el.hasOwnProperty(filterName) && !isClass) return false
        const testArr = this.filters[filterName].reduce(getTestValues, [])
        // exception for character classes; they have a different structure
        if (isClass) return el.classes.fromClassList.some(cl => testArr.includes(cl.name))
        if (Array.isArray(el[filterName])) return el[filterName].every(val => testArr.includes(val))
        return testArr.includes(el[filterName][filterName] || el[filterName])
      })
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
