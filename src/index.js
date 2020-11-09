import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import 'assets/plugins/nucleo/css/nucleo.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'assets/scss/dashboard-react.scss'

import AdminLayout from 'layouts/Admin.js'
import AuthLayout from 'layouts/Auth.js'

import { useAuth } from './auth'

import './App.css'

export default function App() {
	const [logged] = useAuth()
	return (
		<div className='App'>
			<BrowserRouter>
				<Switch>
					{logged && <AdminLayout />}
					{!logged && <AuthLayout />}
					<Redirect from='/' to='/admin/index' />
				</Switch>
			</BrowserRouter>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
