import Profile from 'views/examples/Profile.js'
import Currency from './views/currency/Currency'
import Register from 'views/examples/Register.js'
import Login from 'views/examples/Login.js'

var routes = [
	{
		path: '/index',
		name: 'Dashboard',
		icon: 'ni ni-tv-2 text-primary',
		component: Currency,
		layout: '/admin',
		action: undefined,
	},
	{
		path: '/user-profile',
		name: 'My Profile',
		icon: 'ni ni-single-02 text-yellow',
		component: Profile,
		layout: '/admin',
		action: undefined,
	},
	{
		path: '/login',
		name: 'Login',
		icon: 'fas fa-unlock-alt text-info',
		component: Login,
		layout: '/auth',
		action: undefined,
	},
	{
		path: '/register',
		name: 'Register',
		icon: 'ni ni-circle-08 text-pink',
		component: Register,
		layout: '/auth',
		action: undefined,
	},
	{
		path: '/login',
		name: 'Logout',
		icon: 'fas fa-sign-out-alt text-grey',
		layout: '/auth',
		action: 'disconnect',
	},
]
export default routes
