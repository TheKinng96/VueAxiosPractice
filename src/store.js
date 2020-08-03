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
        authUser(state, userData) {
            state.idToken = userData.token;
            state.userId = userData.userId
        }
    },
    actions: {
        // eslint-disable-next-line no-unused-vars
        signup({commit}, authData) {
            axios.post('/accounts:signUp?key=AIzaSyBziIMIOQ2yPdKXNb-wG6cfMoco4w8Eqjg', {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            })
                .then(response => {
                    console.log(response)
                    commit('authUser', {
                        token: response.data.idToken,
                        userId: response.data.localId
                    })
                })
                .catch(error => console.log(error))
        },
        // eslint-disable-next-line no-unused-vars
        signin({commit}, authData) {
            axios.post('/accounts:signInWithPassword?key=AIzaSyBziIMIOQ2yPdKXNb-wG6cfMoco4w8Eqjg', {
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            }).then(response => {
                console.log(response)
                commit('authUser', {
                    token: response.data.idToken,
                    userId: response.data.localId
                })
            })
                .catch(error => console.log(error))
        }
    },
    getters: {}
})