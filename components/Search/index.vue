<template>
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
</template>

<script>
import _ from 'lodash'

export default {
  name: 'search',
  props: {
    model: Array,
    searchField: String,
    searchType: String
  },
  data () {
    return {
      search: '',
      filtered: this.model
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
    query: _.debounce(function () {
      this.filtered = this.model.filter(i => i[this.searchField].toLowerCase().includes(this.search.toLowerCase()))
      this.$emit('update-data', this.filtered)
    }, 500)
  },
  created () {
    this.$emit('update-data', this.filtered)
  }
}
</script>

<style>

</style>
