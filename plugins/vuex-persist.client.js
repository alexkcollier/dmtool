import VuexPersist from 'vuex-persist'

export default ({ store }) => {
  let hasLocalStorage

  try {
    localStorage.setItem('test', 'test')
    localStorage.getItem('test')

    hasLocalStorage = localStorage.getItem('test') === 'test'
    localStorage.removeItem('test')
  } catch (e) {
    console.warn('Local storage is not available')
    hasLocalStorage = false
  }

  if (hasLocalStorage) {
    return new VuexPersist({
      key: 'vuex',
      storage: window.localStorage,
      modules: ['roll-dice', 'encounter', 'dataVersion'],
    }).plugin(store)
  }
}
