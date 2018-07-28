import Vue from 'vue'

export const state = () => ({
  searchString: '',
  filters: {}
})

export const mutations = {
  INIT_FILTER: (state, { filter, options }) => {
    Vue.set(state.filters, filter, options)
  },

  UPDATE_FILTER: (state, { filter, optionIndex, value }) => {
    state.filters[filter][optionIndex].allowed = value
  },

  UPDATE_SEARCH_STRING: (state, searchTerm) => (state.searchString = searchTerm)
}

export const getters = {
  hasFilterApplied: ({ filters }) => {
    const concatOptions = (l, f) => l.concat(filters[f])
    return Object.keys(filters)
      .reduce(concatOptions, [])
      .some(o => !o.allowed)
  }
}
