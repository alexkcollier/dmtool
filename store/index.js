import VuexPersist from 'vuex-persist'

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: state => ({ encounter: state.encounter })
})

export const plugins = [vuexLocalStorage.plugin]
