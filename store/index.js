import VuexPersist from 'vuex-persist'

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  modules: ['encounter', 'roll-dice']
})

export const plugins = [vuexLocalStorage.plugin]
