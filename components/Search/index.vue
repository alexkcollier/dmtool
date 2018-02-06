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

    <div class="card">
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
            <!-- <a :class="{'is-active': showFilter == 'Rarity'}" @click="showFilter = 'Rarity'" class="card-footer-item">Rarity</a>
            <a :class="{'is-active': showFilter == 'Source'}" @click="showFilter = 'Source'" class="card-footer-item">Source</a> -->
          </div>

          <div class="card-content">

            <!-- Rarity filter -->
            <!-- <template v-if="showFilter === 'Rarity'">
              <b-field grouped group-multiline>
                <div v-for="level in rarity" :key="level.name" class="control">
                  <b-switch v-model="level.value" @input="makeRarityQuery">{{ level.name }}</b-switch>
                </div>
              </b-field>
            </template> -->

            <!-- Source filter -->
            <!-- <template v-else-if="showFilter === 'Source'">
              <b-field grouped group-multiline>
                <div v-for="s in source" :key="s.name" class="control">
                  <b-switch v-model="s.value" @input="makeSourceQuery">{{ s.name }}</b-switch>
                </div>
              </b-field>
            </template> -->
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
    filterFields: Array
  },
  data () {
    return {
      search: '',
      filtered: this.model,
      collapseFilters: true,
      filters: []
    }
  },
  computed: {
    placeholder () {
      return this.searchType ? `Search for ${this.searchType}` : 'Search'
    }
  },
  methods: {
    clearSearch: function () {
      this.search = ''
      this.query()
    },
    getFilters: function (...filterList) { // Generate filter lists from data
      filterList.forEach(filterList => {
        this.filters.push({[filterList]: []})

        let options = [...new Set(this.model.map(item => item[filterList]))]
        console.log(options, this.filters)
        // options.forEach(item => { if (!_.includes(filterList, item)) this.filters[filterList].push({ name: item, value: true }) })
      })
    },
    query: _.debounce(function () {
      this.filtered = this.model.filter(i => i[this.searchField].toLowerCase().includes(this.search.toLowerCase()))
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
