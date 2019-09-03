import store from '../store/store'
import Firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAJqnMUF9b5eWRUWj-a4ics9BXtObzcaTo",
    authDomain: "marshmallow-744b1.firebaseapp.com",
    databaseURL: "https://marshmallow-744b1.firebaseio.com",
    projectId: "marshmallow-744b1",
    storageBucket: "marshmallow-744b1.appspot.com",
    messagingSenderId: "692683414250",
    appId: "1:692683414250:web:26d71c8fe5ee8e2d"
}

export default {
    install: (Vue, options) => {
    const firebase = Firebase.initializeApp(config)
    const auth = firebase.auth()
    const db = firebase.firestore()
    Vue.prototype.$auth = {
        login: async (username, pass) => {
            return await auth.signInWithEmailAndPassword(username, pass)
        },
        logout: async () => {
            await auth.signOut()
        },
    }
    Vue.prototype.$db = db
    auth.onAuthStateChanged(user => {
            store.commit('updateUser',{ user })
        })
    }
}