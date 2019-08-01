import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate'
import { isThisHour } from 'date-fns';

Vue.config.productionTip = false

Vue.use(Vuelidate)

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')