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
    if (!state.encounter.includes(payload)) state.encounter.push(payload)
  },

  REMOVE_FROM_ENCOUNTER: (state, payload) =>
    (state.encounter = state.encounter.filter(e => e !== payload)),

  CLEAR_ENCOUNTER: state => (state.encounter = [])
}
