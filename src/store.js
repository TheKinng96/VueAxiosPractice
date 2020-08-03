import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
  },
  mutations: {

  },
  actions: {
    signup({commit}, authData){
      axios.post('/accounts:signUp?key=AIzaSyBziIMIOQ2yPdKXNb-wG6cfMoco4w8Eqjg', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
          .then(response => console.log(response))
          .catch(error => console.log(error))
    },
    signin({commit},authData){
      axios.post('/accounts:signInWithPassword?key=AIzaSyBziIMIOQ2yPdKXNb-wG6cfMoco4w8Eqjg', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }).then(response => console.log(response))
          .catch(error => console.log(error))
    }
  },
  getters: {

  }
})