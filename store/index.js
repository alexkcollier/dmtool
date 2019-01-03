export const state = () => ({
  dataVersion: ''
})

export const mutations = {
  UPDATE_VERSION: (state, { version }) => (state.dataVersion = version)
}
