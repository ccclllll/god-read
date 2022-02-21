import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import NutUI from '@nutui/nutui';
import '@nutui/nutui/dist/nutui.css';
import './assets/common.scss';
import service from './services'
Vue.prototype.$service = service
NutUI.install(Vue);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')