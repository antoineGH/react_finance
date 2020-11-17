import Profile from 'views/examples/Profile.js'
import Currency from './views/currency/Currency'
import Register from 'views/examples/Register.js'
import Login from 'views/examples/Login.js'
import Convert from 'views/examples/Convert.js'
import RateGraph from 'views/examples/RateGraph.js'
import HistoricalGraph from 'views/examples/HistoricalGraph.js'
import HistoricalRate from 'views/examples/HistoricalRate.js'
import FinanceFeed from 'views/examples/FinanceFeed.js'

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
		path: '/convert',
		name: 'Convert',
		icon: 'fas fa-wallet text-yellow',
		component: Convert,
		layout: '/admin',
		action: undefined,
	},
	{
		path: '/rate-graph',
		name: 'Rate Graph',
		icon: 'fas fa-chart-area text-red',
		component: RateGraph,
		layout: '/admin',
		action: undefined,
	},
	{
		path: '/hist-graph',
		name: 'Historical Graph',
		icon: 'fas fa-chart-bar text-purple',
		component: HistoricalGraph,
		layout: '/admin',
		action: undefined,
	},
	{
		path: '/hist-rate',
		name: 'Historical Rate',
		icon: 'fas fa-history text-blue',
		component: HistoricalRate,
		layout: '/admin',
		action: undefined,
	},
	{
		path: '/finance-feed',
		name: 'Finance Feed',
		icon: 'far fa-newspaper text-orange',
		component: FinanceFeed,
		layout: '/admin',
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
