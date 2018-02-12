import Vue from 'vue'
import ScrollView from 'vue-scrollview'

// default options
const options = {
  throttle: 50,
  callbacks: []
}

Vue.use(ScrollView, options) // optional options object may be passed in at initialization.
