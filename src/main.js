import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store/store'
import firebase from 'firebase'
import firebaseAuthPlugin from './plugins/firebaseAuthPlugin'
import vuetify from './plugins/vuetify';

import Vuelidate from 'vuelidate'
import { isThisHour } from 'date-fns';

Vue.config.productionTip = false

let app = ''

Vue.use(firebaseAuthPlugin)
Vue.use(Vuelidate)

sync(store, router)

firebase.auth().onAuthStateChanged(() => {
    if(!app) {
        app = new Vue({
            router,
            vuetify,
            store,
            render: h => h(App)
        }).$mount('#app')
    }
})