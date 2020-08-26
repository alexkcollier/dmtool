export const state = () => ({
  encounter: [],
})

export const getters = {
  encounterCreatures: ({ encounter }) => {
    return [...new Set(encounter.map(c => `${c.name} - ${c.source}`))]
  },
}

export const mutations = {
  ADD_TO_ENCOUNTER: (state, payload) => {
    if (!state.encounter.map(c => c.name + c.source).includes(payload.name + payload.source)) {
      state.encounter.push(payload)
    }
  },

  REMOVE_FROM_ENCOUNTER: (state, payload) => {
    const deleteIdx = state.encounter.findIndex((c) => {
      return c.name === payload.name && c.source === payload.source
    })

    state.encounter.splice(deleteIdx, 1)
  },

  CLEAR_ENCOUNTER: (state) => { state.encounter = [] },
}
