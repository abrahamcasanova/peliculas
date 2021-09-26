import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import vuetify from '@/plugins/vuetify'
import { VueMaskDirective } from 'v-mask'
import VueMask from 'v-mask'
import AxiosPlugin from 'vue-axios-cors'
import moment from 'moment'
import Vue2Filters from 'vue2-filters'
import VueMeta from 'vue-meta'
import LoadScript from 'vue-plugin-load-script'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  /* const { mockXHR } = require('../mock')
  mockXHR() */
}
Vue.directive('mask', VueMaskDirective)
Vue.use(VueMask)
Vue.use(AxiosPlugin)
Vue.use(Vue2Filters)
Vue.use(VueMeta)
Vue.use(LoadScript)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.filter('formatDateTime', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm A')
  }
})

Vue.config.productionTip = false

Vue.prototype.$apiKey = 'key_zeuz_api_yIw6yqdovu1y5Tr6zccFEaBTGG3fCIaN'
moment.locale('es')
Vue.prototype.moment = moment

Vue.loadScript('https://chimpstatic.com/mcjs-connected/js/users/00e172d0ef0bc0e60dae401b7/0dba2f31e7a765b627ba64d87.js')
  .then(() => {
    console.log('cargado')
  })
  .catch(() => {
  // Failed to fetch script
  })

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
})
