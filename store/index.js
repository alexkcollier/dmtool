import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      encounter: []
    },
    mutations: {
      ADD_TO_ENCOUNTER: function(state, payload) {
        if (!state.encounter.includes(payload)) state.encounter.push(payload)
      },
      REMOVE_FROM_ENCOUNTER: function(state, payload) {
        state.encounter = state.encounter.filter(e => e !== payload)
      },
      CLEAR_ENCOUNTER: function(state) {
        state.encounter = []
      }
    }
  })
}

export default createStore
