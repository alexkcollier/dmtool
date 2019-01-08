export const state = () => ({
  encounter: []
})

export const getters = {
  encounterCreatures: ({ encounter }) => {
    return [...new Set(encounter.map(c => `${c.name} - ${c.source}`))]
  }
}

export const mutations = {
  ADD_TO_ENCOUNTER: (state, payload) => {
    if (!state.encounter.map(c => c.name + c.source).includes(payload.name + payload.source)) {
      state.encounter.push(payload)
    }
  },

  REMOVE_FROM_ENCOUNTER: (state, payload) => {
    state.encounter = state.encounter.filter(c => {
      return c.name !== payload.name && c.source !== payload.source
    })
  },

  CLEAR_ENCOUNTER: state => (state.encounter = [])
}
