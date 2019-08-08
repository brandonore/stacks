import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import firebase from 'firebase'
import vuetify from './plugins/vuetify';

import Vuelidate from 'vuelidate'
import { isThisHour } from 'date-fns';

Vue.config.productionTip = false

let app = ''

Vue.use(Vuelidate)

firebase.auth().onAuthStateChanged(() => {
    if(!app) {
        app = new Vue({
            router,
            vuetify,
            render: h => h(App)
        }).$mount('#app')
    }
})