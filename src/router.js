import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import NProgress from 'nprogress'

import Dashboard from './views/Dashboard'
import Trim from './views/Trim'
import Extract from './views/Extract'
import Package from './views/Package'
import Settings from './views/Settings'
import Calendar from './views/Calendar'
import Login from './views/Login'
import Signup from './views/Signup'

import '../node_modules/nprogress/nprogress.css'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: "*",
            redirect: '/login'
        },
        {
            path: "/",
            redirect: "/login"
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: Dashboard,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/extract",
            name: "extract",
            component: Extract,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/package",
            name: "package",
            component: Package,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/trim",
            name: "trim",
            component: Trim,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/calendar",
            name: "calendar",
            component: Calendar,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/settings",
            name: "settings",
            component: Settings,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/signup",
            name: "signup",
            component: Signup
        }
    ]
})

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // NProgress.start()

    if(requiresAuth && !currentUser) {
        next('login')
    } else if(!requiresAuth && currentUser) {
        next('dashboard')
    } else {
        next()
    }
})

// router.afterEach((to, from) => {
//     NProgress.done()
// })

export default router