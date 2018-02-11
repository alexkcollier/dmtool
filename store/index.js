import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      user: null,
      encounter: []
    },
    mutations: {
      addToEncounter: function (state, payload) {
        if (!state.encounter.includes(payload)) state.encounter.push(payload)
      },
      removeFromEncounter: function (state, payload) {
        state.encounter = state.encounter.filter(e => e !== payload)
      },
      clearEncounter: function (state) {
        state.encounter = []
      }
    }
  })
}

export default createStore
