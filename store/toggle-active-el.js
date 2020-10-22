export const state = () => ({
  activeEl: null,
})

export const mutations = {
  SET_ACTIVE_EL: (state, payload) => { state.activeEl = payload },
}

export const actions = {
  SET_ACTIVE_EL: ({ dispatch, commit, state }, { el, delay }) => {
    const oldActive = state.activeEl !== null
    const activateNext = () =>
      new Promise(resolve =>
        setTimeout(() => {
          commit('SET_ACTIVE_EL', el)
          resolve()
        }, oldActive ? delay : 0),
      )
    return dispatch('CLEAR_ACTIVE_EL').then(activateNext)
  },

  CLEAR_ACTIVE_EL: ({ commit }) => {
    commit('SET_ACTIVE_EL', null)
    return Promise.resolve()
  },
}
