import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import Vuelidate from "vuelidate";

import router from './router'
import store from './store'

axios.defaults.baseURL = 'https://vuehttppractice-1e595.firebaseio.com/'

axios.interceptors.request.use(config => {
  console.log('request interceptor',config)
  return config
})

axios.interceptors.response.use(res => {
  console.log('res interceptor', res)
  return res
})

Vue.use(Vuelidate)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
