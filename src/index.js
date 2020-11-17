import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

import 'assets/plugins/nucleo/css/nucleo.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'assets/scss/dashboard-react.scss'

import AdminLayout from 'layouts/Admin.js'
import AuthLayout from 'layouts/Auth.js'

import { useAuth } from './auth'

import './App.css'

export default function App() {
	const [logged] = useAuth()

	if (logged) {
		const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY')).access_token
		const decoded = jwt_decode(token).user_claims
		const { id, username, email, first_name, last_name } = decoded
	}
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
