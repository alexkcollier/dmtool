export const state = () => ({
  magicItems: []
})

export const mutations = {
  INIT_MAGIC_ITEMS: (state, payload) => (state.magicItems = payload)
}
