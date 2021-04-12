import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'

import App from './App.vue'
import router from './router'
import store from './store'
import hljs from 'highlight.js'
import 'highlight.js/styles/xcode.css'
// hljs.initLineNumbersOnLoad()
hljs.addPlugin({
  'after:highlightBlock': ({ block, result }) => {
    result.value = result.value.replace(/^/gm, '<span class="row-number"></span>')
  }
})
Vue.use(hljs.vuePlugin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
