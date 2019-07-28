import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard'
import Trim from './views/Trim'
import Extract from './views/Extract'
import Package from './views/Package'
import Settings from './views/Settings'
import Calendar from './views/Calendar'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: "/",
			name: "dashboard",
			component: Dashboard
		},
		{
			path: "/extract",
			name: "extract",
			component: Extract
		},
		{
			path: "/package",
			name: "package",
			component: Package
		},
		{
			path: "/trim",
			name: "trim",
			component: Trim
		},
		{
			path: "/calendar",
			name: "calendar",
			component: Calendar
		},
		{
			path: "/settings",
			name: "settings",
			component: Settings
		}
	]
})
