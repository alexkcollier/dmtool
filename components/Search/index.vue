<template>
  <div>
    <!-- Search box -->
    <b-field>
      <div class="control has-icons-left is-expanded">
        <input
          @keyup="query"
          v-model="search" 
          :class="{'is-danger': !filtered.length }"
          class="input"
          type="text"
          :placeholder="placeholder">
          <b-icon icon="magnify" size="is-small" class="is-left"></b-icon>
      </div>
      <div class="control">
        <button class="button is-primary" style="margin:0;" :disabled="!search" @click="clearSearch">Clear</button>
      </div>
    </b-field>

    <div v-if="filterFields.length" class="card">
      <!-- Filters -->
      <div class="card-header">
        <a @click="collapseFilters = !collapseFilters" class="card-header-title">
          Filters
          <b-icon :icon="collapseFilters ? 'chevron-down' : 'chevron-up'"/>
        </a>
      </div>

      <transition name="fade-grow">
        <div v-show="!collapseFilters">

          <div class="card-header">
            <template v-for="(data, filter) in filters">
              <a class="card-footer-item" :key="filter" :class="{'is-active': visibleFilterOptions === filter}" @click="showFilter = filter">{{ filter }}</a>
            </template>
          </div>

          <div class="card-content">
            <template>
              <b-field grouped group-multiline>
                <div v-for="option in filters[visibleFilterOptions]" class="control" :key="option.name">
                  <b-switch v-model="option.value">{{ option.name }}</b-switch>
                </div>
              </b-field>
            </template>
          </div>
        </div>
      </transition>
    </div>
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
      search: '',
      filtered: this.model,
      collapseFilters: true,
      filters: {},
      showFilter: ''
    }
  },
  computed: {
    placeholder () {
      return this.searchType ? `Search for ${this.searchType}` : 'Search'
    },
    visibleFilterOptions () {
      return this.showFilter ? this.showFilter : (Object.keys(this.filters) ? Object.keys(this.filters)[0] : '')
    }
  },
  methods: {
    clearSearch: function () {
      this.search = ''
      this.query()
    },
    getFilters: function (...filterList) { // Generate filter lists from data
      filterList.forEach(filterList => {
        let options = [...new Set(this.model.map(item => item[filterList]))]
        options = options.map(item => { return { name: item, value: true } })
        this.$set(this.filters, filterList, options) // Must use vm.set to make these properties reactive
      })
    },
    query: _.debounce(function () {
      this.filtered = this.model.filter(i => {
        return i[this.searchField].toLowerCase().includes(this.search.toLowerCase())
      })
      this.$emit('update-data', this.filtered)
    }, 500)
  },
  created () {
    this.getFilters(...this.filterFields)
    this.$emit('update-data', this.filtered)
  }
}
</script>

<style>

</style>
