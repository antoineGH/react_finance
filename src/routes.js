import Profile from 'views/examples/Profile.js'
import Currency from './views/currency/Currency'

var routes = [
	{
		path: '/index',
		name: 'Dashboard',
		icon: 'ni ni-tv-2 text-primary',
		component: Currency,
		layout: '/admin',
	},
	{
		path: '/user-profile',
		name: 'User Profile',
		icon: 'ni ni-single-02 text-yellow',
		component: Profile,
		layout: '/admin',
	},
]
export default routes
