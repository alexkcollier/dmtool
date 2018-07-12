export const state = () => ({
  spells: []
})

export const mutations = {
  INIT_SPELLS: (state, payload) => (state.spells = payload)
}
