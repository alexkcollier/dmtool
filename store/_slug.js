import orderBy from 'lodash.orderby'
import Vue from 'vue'
import Fuse from 'fuse.js'

const state = () => ({
  data: [],
  searchString: '',
  searchFields: ['name'],
  hasFilters: false,
  filters: {},
  searchIndex: null,
  queryResult: [],
  eTag: '',
})

const mutations = {
  INIT_DATA: (state, { data }) => {
    state.data = data
    state.queryResult = data
  },
  INIT_FILTER: (state, { filter, options }) => Vue.set(state.filters, filter, options),
  INIT_FILTER_STATUS: (state, { status }) => { state.hasFilters = status },
  INIT_SEARCH_INDEX: (state, { data }) => {
    state.searchIndex = new Fuse(data, configureFuse(state.searchFields))
  },
  UPDATE_ETAG: (state, { eTag }) => { state.eTag = eTag },
  UPDATE_FILTER: (state, { filter, optionIndex, value }) => {
    state.filters[filter][optionIndex].allowed = value
  },
  UPDATE_SEARCH_STRING: (state, searchTerm) => { state.searchString = searchTerm },
  UPDATE_RESULT: (state, { queryResult }) => { state.queryResult = queryResult },
}

const getters = {
  hasFilterApplied: ({ filters }) => {
    return Object.keys(filters)
      .reduce((acc, filterName) => acc.concat(filters[filterName]), [])
      .some(o => !o.allowed)
  },
}

const actions = {
  initStore: ({ commit, state }, { data = state.data, eTag }) => {
    commit('INIT_DATA', { data: orderBy(data, state.searchFields[0]) })
    commit('INIT_SEARCH_INDEX', { data })
    commit('UPDATE_ETAG', { eTag })
    return Promise.resolve()
  },

  initFilters: async ({ state, commit }, { filterFields }) => {
    const filters = await Promise.all(
      filterFields.map(async (filter) => {
        const values = await uniqueValues(state.data, filter)
        const initOptions = values.map(name => ({ name, allowed: true }))

        return { filter, options: sortFilterOptions(initOptions) }
      }),
    )

    filters.forEach(filter => commit('INIT_FILTER', filter))
    commit('INIT_FILTER_STATUS', { status: true })
    return Promise.resolve()
  },

  setAllOptions: ({ dispatch, state }, { filter, value }) => {
    return Promise.all(
      state.filters[filter].map((o, optionIndex) =>
        dispatch('applyFilter', { filter, optionIndex, value }),
      ),
    )
  },

  resetFilters: ({ dispatch, state }) => {
    return Promise.all(
      Object.keys(state.filters).map(filter => dispatch('setAllOptions', { filter, value: true })),
    )
  },

  applyFilter: ({ commit }, { filter, optionIndex, value }) => {
    return new Promise((resolve) => {
      commit('UPDATE_FILTER', { filter, optionIndex, value })
      resolve()
    })
  },

  query: ({ commit, state }) => {
    return new Promise((resolve) => {
      const { searchIndex, searchString, data, filters } = state
      const shouldSeach = searchIndex && searchString
      const searchResult = shouldSeach ? searchIndex.search(searchString.trim()) : data
      const queryResult = searchResult.filter(el => passesFilters(filters, el))

      commit('UPDATE_RESULT', { queryResult })
      resolve()
    })
  },
}

function configureFuse (searchFields) {
  return {
    shouldSort: true,
    threshold: 0.25,
    location: 0,
    distance: 100,
    tokenize: true,
    matchAllTokens: true,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: searchFields,
  }
}

function uniqueValues (data, filterName) {
  const isClass = filterName === 'class'
  const values = data.reduce((acc, el) => {
    // `el.class` never exists, but we want a pretty filter name
    if (isClass) return acc.concat(el.classes.fromClassList.map(cl => cl.name))
    // Allows key to not exist on every element in model
    if (!el?.[filterName]) return acc
    return acc.concat(el[filterName][filterName] || el[filterName])
  }, [])

  return Promise.resolve([...new Set(values)])
}

function sortFilterOptions (options) {
  return orderBy(options, filterSortFn)
}

function filterSortFn ({ name }) {
  if (isNaN(name)) {
    if (name === 'Cantrip') return 0
    if (name.match(/\d\/\d/)) return name[0] / name[2]
    if (name === 'Unknown') return Number(name)
    return name
  }

  return Number(name)
}

function passesFilters (filters, el) {
  const filterNames = Object.keys(filters)
  return filterNames.every((filterName) => {
    if (filters[filterName].every(option => option.allowed)) return true
    const getTestValues = (test, option) => (option.allowed ? test.concat(option.name) : test)
    const isClass = filterName === 'class'
    // spells use 'classes' rather than 'class' as the key; `el.class` never exists
    if (!el?.[filterName] && !isClass) return false
    const testArr = filters[filterName].reduce(getTestValues, [])
    // exception for character classes; they have a different structure
    if (isClass) return el.classes.fromClassList.some(cl => testArr.includes(cl.name))
    if (Array.isArray(el[filterName])) return el[filterName].every(val => testArr.includes(val))
    return testArr.includes(el[filterName][filterName] || el[filterName])
  })
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
