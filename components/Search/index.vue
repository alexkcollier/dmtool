<template>
  <div>
    <!-- Search box -->
    <b-field>
      <div class="control has-icons-left is-expanded">
        <input
          @keyup="query"
          v-model="searchTerm" 
          :class="{'is-danger': !queryResult.length }"
          class="input"
          type="text"
          :placeholder="placeholder">
          <b-icon icon="magnify" size="is-small" class="is-left"></b-icon>
      </div>
      <div class="control">
        <button class="button is-primary" style="margin:0;" :disabled="!searchTerm" @click="clearSearch">Clear</button>
      </div>
    </b-field>

    <!-- Filters -->
    <div v-if="filterFields.length" class="card">
      <div class="card-header">

        <!-- Filter collapse control-->
        <a @click="collapseFilters = !collapseFilters" class="card-header-title">
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
              <a class="card-footer-item is-capitalized"
                 :key="filter"
                 :class="{'is-active': visibleFilterOptions === filter}"
                 @click="visibleFilter = filter">
                 {{ filter }}
              </a>
            </template>
          </div>

          <!-- Filter options -->
          <div class="card-content">
            <b-field grouped group-multiline>
              <div v-for="option in filters[visibleFilterOptions]" class="control" :key="option.name">
                <b-switch v-model="option.value" @input="query">{{ option.name }}</b-switch>
              </div>
            </b-field>
          </div>

        </div>
      </transition>
    </div>

    <!-- Result count -->
    <div class="control">
      <div class="help has-text-right" :class="{'is-danger': resultCount == 0}">{{ resultCount }} item<span v-if="resultCount != 1">s</span> found.</div>
    </div>

    <hr>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'search',
  props: {
    model: Array,
    searchField: String,
    searchType: String,
    filterFields: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      searchTerm: '',
      queryResult: _.sortBy(this.model, 'name'),
      collapseFilters: true,
      filters: {},
      visibleFilter: ''
    }
  },
  computed: {
    placeholder () {
      return this.searchType ? `Search for ${this.searchType}` : 'Search'
    },
    visibleFilterOptions () {
      return this.visibleFilter ? this.visibleFilter : (Object.keys(this.filters) ? Object.keys(this.filters)[0] : '')
    },
    resultCount: function () { return this.queryResult.length }
  },
  methods: {
    clearSearch: function () {
      this.searchTerm = ''
      this.query()
    },
    getFilters: function (...filters) { // Generate filter lists from data
      filters.forEach(filters => {
        let options = [...new Set(this.model.map(item => item[filters]))] // Get all possible options from model
        options = options.map(item => { return { name: item, value: true } }) // Create array of options
        this.$set(this.filters, filters, options) // Add filters. Must use vm.set to make these properties reactive
      })
    },
    query: _.debounce(function () {
      const filterTest = (filter, testValue) => { // check if filter includes testValue from model
        let trueOptions = []
        this.filters[filter].forEach(option => { if (option.value) trueOptions.push(option.name) }) // Create list of options that are true
        return trueOptions.includes(testValue) // return if testValue is a true option
      }

      let result = this.model.filter(el => {
        let filterTestRes = true // All filter options default to true
        Object.keys(this.filters).forEach(filter => { filterTestRes *= filterTest(filter, el[filter]) }) // check each element against all filters
        let test = el[this.searchField].toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        filterTestRes // ensure element contains search term and passes filter test
        return test
      })

      this.queryResult = result

      this.$emit('update-data', this.queryResult)
    }, 500)
  },
  created () {
    this.getFilters(...this.filterFields)
    this.$emit('update-data', this.queryResult)
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
    &-title, {
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

hr { margin-top: 0.25em; }
</style>
