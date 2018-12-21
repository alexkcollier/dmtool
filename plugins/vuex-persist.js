import VuexPersist from 'vuex-persist'

export default ({ store }) => {
  return new VuexPersist({
    key: 'vuex',
    storage: window.localStorage,
    modules: ['encounter', 'roll-dice']
  }).plugin(store)
}
