import App from './App'
import Vue from 'vue'

// 引入全局mixins
import mixins from "@/common/mixins/mixins.js"
Vue.mixin(mixins)


// 引入util
import * as util from "@/common/js/util.js"
Vue.prototype.$util = util

// vuex
import store from "@/store/index.js"

// #ifndef VUE3
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif