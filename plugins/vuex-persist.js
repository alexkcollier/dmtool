import VuexPersist from 'vuex-persist'

export default ({ store }) => {
  return new VuexPersist({
    key: 'vuex',
    storage: window.localStorage,
    modules: ['roll-dice', 'encounter', 'dataVersion']
  }).plugin(store)
}
