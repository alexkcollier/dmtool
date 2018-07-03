export const state = () => ({
  activeEl: null
})

export const mutations = {
  SET_ACTIVE_EL(state, payload) {
    state.activeEl = payload
  }
}

export const actions = {
  SET_ACTIVE_EL({ dispatch, commit, state }, { el, delay }) {
    const oldActive = state.activeEl !== null
    return dispatch('CLEAR_ACTIVE_EL').then(() => {
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          commit('SET_ACTIVE_EL', el)
          resolve()
        }, oldActive ? delay : 0)
      )
    })
  },
  CLEAR_ACTIVE_EL({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_ACTIVE_EL', null)
      resolve()
    })
  }
}
