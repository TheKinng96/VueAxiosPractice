import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'
import router from "@/router";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        idToken: null,
        userId: null,
        user: null,
        loginError:null
    },
    mutations: {
        authUser(state, userData) {
            state.idToken = userData.token;
            state.userId = userData.userId
        },
        storeUser(state, user){
            state.user = user
        },
        clearData(state){
            state.userId = null;
            state.idToken = null;
        }
    },
    actions: {
        setLogoutTimer({commit}, expirationTime){
            setTimeout(()=> {
                commit('clearData')
            }, expirationTime * 1000)
        },
        signup({commit, dispatch}, authData) {
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
                    const now = new Date()
                    const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
                    localStorage.setItem('token', response.data.idToken)
                    localStorage.setItem('expiresIn', expirationDate)
                    localStorage.setItem('userId', response.data.userId)
                    dispatch('storeUser', authData)
                    dispatch('setLogoutTimer', response.data.expiresIn)
                })
                .catch(error => console.log(error))
        },
        signin({commit, dispatch}, authData) {
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
                const now = new Date()
                const expirationDate = new Date(now.getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken)
                localStorage.setItem('userId', response.data.userId)
                localStorage.setItem('expirationDate', expirationDate)
                dispatch('setLogoutTimer', response.data.expiresIn)
            })
                .catch(error => {
                    console.log(error)

                })
        },
        storeUser ({state}, userData){
            if (!state.idToken){
                return
            }
            globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
                .then(res => console.log(res))
                .catch(err => console.log(err))
        },
        fetchData({commit, state}){
            if (!state.idToken){
                return
            }
            globalAxios.get('/users.json' + '?auth=' + state.idToken)
                .then(res => {
                    const data = res.data;
                    const users = []
                    for (let key in data) {
                        const user = data[key]
                        user.id = key;
                        users.push(user)
                    }
                    commit('storeUser', users[0])
                }).catch(err => console.log(err))
        },
        logout({commit}) {
            commit('clearData')
            localStorage.removeItem('token')
            localStorage.removeItem('expirationDate')
            localStorage.removeItem('userId')
            router.replace('/signin')
        },
        autoLogin({commit}){
            const token = localStorage.getItem('token')
            if (!token){
                return
            }
            const expirationDate = localStorage.getItem('expirationDate')
            const now = new Date()
            if (now >= expirationDate) {
                return
            }
            const userId = localStorage.getItem(('userId'))
            commit('authUser', {
                token: token,
                userId: userId
            })
        }
    },
    getters: {
        user(state){
            return state.user
        },
        isAuthenticated(state){
            return state.idToken !== null
        }
    }
})