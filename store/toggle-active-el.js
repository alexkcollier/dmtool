export const state = () => ({
  activeEl: null
})

export const mutations = {
  SET_ACTIVE_EL: function(state, payload) {
    state.activeEl = payload.activeEl
  }
}

export const actions = {
  SET_ACTIVE_EL: function({ commit }, payload) {
    commit('SET_ACTIVE_EL', payload)
  },
  CLEAR_ACTIVE_EL: function({ commit }) {
    commit('SET_ACTIVE_EL', { activeEl: null })
  }
}
