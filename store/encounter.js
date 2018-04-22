export const state = () => ({
  encounter: []
})

export const getters = {
  encounterCreatures: function(state) {
    return [...new Set(state.encounter.map(creature => creature.name))]
  }
}

export const mutations = {
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
