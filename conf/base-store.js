import { sortBy } from 'lodash'
import Vue from 'vue'
import Fuse from 'fuse.js'

function configureFuse(searchFields) {
  return {
    shouldSort: true,
    threshold: 0.25,
    location: 0,
    distance: 100,
    tokenize: true,
    matchAllTokens: true,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: searchFields
  }
}
export const state = () => ({
  data: [],
  searchString: '',
  searchFields: ['name'],
  filters: {},
  searchIndex: null
})

export const mutations = {
  INIT_DATA: (state, { data }) => (state.data = [...data]),
  INIT_FILTER: (state, { filter, options }) => Vue.set(state.filters, filter, options),
  INIT_SEARCH_INDEX: (state, { data }) => {
    state.searchIndex = new Fuse(data, configureFuse(state.searchFields))
  },
  UPDATE_FILTER: (state, { filter, optionIndex, value }) => {
    state.filters[filter][optionIndex].allowed = value
  },
  UPDATE_SEARCH_STRING: (state, searchTerm) => (state.searchString = searchTerm)
}

export const getters = {
  hasFilterApplied: ({ filters }) => {
    return Object.keys(filters)
      .reduce((acc, filterName) => acc.concat(filters[filterName]), [])
      .some(o => !o.allowed)
  },

  queryResult: ({ searchIndex, searchString, data, filters }) => {
    const searchResult = searchIndex && searchString ? searchIndex.search(searchString) : data
    return searchResult.filter(el => passesFilters(filters, el))
  }
}

export const actions = {
  initStore: ({ commit, state }, { data }) => {
    commit('INIT_DATA', { data: sortBy(data, state.searchFields[0]) })
    commit('INIT_SEARCH_INDEX', { data })
  },

  initFilters: async ({ state, commit }, { filterFields }) => {
    const filters = await Promise.all(
      filterFields.map(async filter => {
        const values = await uniqueValues(state.data, filter)
        const initOptions = values.map(name => ({ name, allowed: true }))

        return { filter, options: sortFilterOptions(initOptions) }
      })
    )

    filters.forEach(filter => commit('INIT_FILTER', filter))

    return Promise.resolve()
  },

  setAllOptions: ({ commit, state }, { filter, value }) => {
    state.filters[filter].forEach((o, optionIndex) => {
      commit('UPDATE_FILTER', { filter, optionIndex, value })
    })
  },

  resetFilters: ({ dispatch, state }) => {
    Object.keys(state.filters).forEach(filter => dispatch('setAllOptions', { filter, value: true }))
  }
}

function uniqueValues(data, filterName) {
  const isClass = filterName === 'class'
  const values = data.reduce((acc, el) => {
    // `el.class` never exists, but we want a pretty filter name
    if (isClass) return acc.concat(el.classes.fromClassList.map(cl => cl.name))
    // Allows key to not exist on every element in model
    if (!el.hasOwnProperty(filterName)) return acc
    return acc.concat(el[filterName][filterName] || el[filterName])
  }, [])

  return Promise.resolve([...new Set(values)])
}

function sortFilterOptions(options) {
  return sortBy(options, filterSortFn)
}

function filterSortFn({ name }) {
  if (isNaN(name)) {
    if (name === 'Cantrip') return 0
    if (name.match(/\d\/\d/)) return name[0] / name[2]
    if (name === 'Unknown') return Number(name)
    return name
  }

  return Number(name)
}

function passesFilters(filters, el) {
  const filterNames = Object.keys(filters)
  return filterNames.every(filterName => {
    if (filters[filterName].every(option => option.allowed)) return true
    const getTestValues = (test, option) => (option.allowed ? test.concat(option.name) : test)
    const isClass = filterName === 'class'
    // spells use 'classes' rather than 'class' as the key; `el.class` never exists
    if (!el.hasOwnProperty(filterName) && !isClass) return false
    const testArr = filters[filterName].reduce(getTestValues, [])
    // exception for character classes; they have a different structure
    if (isClass) return el.classes.fromClassList.some(cl => testArr.includes(cl.name))
    if (Array.isArray(el[filterName])) return el[filterName].every(val => testArr.includes(val))
    return testArr.includes(el[filterName][filterName] || el[filterName])
  })
}

export default {
  state,
  getters,
  mutations,
  actions
}
