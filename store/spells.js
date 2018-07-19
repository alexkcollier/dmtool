export const state = () => ({
  searchString: '',
  filters: {}
})

export const mutations = {
  UPDATE_SEARCH_STRING: (state, searchTerm) => (state.searchString = searchTerm)
}
