import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom'
import jwt_decode from 'jwt-decode'

import 'assets/plugins/nucleo/css/nucleo.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'assets/scss/dashboard-react.scss'

import AdminLayout from 'layouts/Admin.js'
import AuthLayout from 'layouts/Auth.js'

import { useAuth } from './auth'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Error from './views/examples/Error'

import './App.css'

export default function App() {
	const [logged] = useAuth()
	let decoded = ''

	if (logged) {
		const token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH_KEY')).access_token
		decoded = jwt_decode(token).user_claims
	}

	return (
		<div className='App'>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<ToastContainer />
			<BrowserRouter>
				<Switch>
					<Route path='/error' component={Error} />
					{logged && <AdminLayout userInfo={decoded} />}
					{!logged && <AuthLayout />}
					<Redirect from='/' to='/admin/index' />
				</Switch>
			</BrowserRouter>
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
