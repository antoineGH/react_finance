import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Container } from 'reactstrap'
import AdminNavbar from 'components/Navbars/AdminNavbar.js'
import AdminFooter from 'components/Footers/AdminFooter.js'
import Sidebar from 'components/Sidebar/Sidebar.js'
import StyleContext from '../views/examples/StyleContext'

import routes from 'routes.js'
import { authFetch } from 'auth'

class Admin extends React.Component {
	constructor(props) {
		super(props)
		this.changeColor = this.changeColor.bind(this)
		this.state = {
			color: localStorage.color,
		}
	}

	componentDidMount() {
		this.getColor()
			.then((response) => {
				this.setState({ color: response.style })
			})
			.catch((error) => {
				console.log(error)
			})
	}

	componentDidUpdate(e) {
		document.documentElement.scrollTop = 0
		document.scrollingElement.scrollTop = 0
		this.refs.mainContent.scrollTop = 0
	}

	async getColor() {
		const response = await authFetch('http://localhost:5000/api/user/setting', {
			method: 'GET',
			headers: {
				'Content-type': 'application/json',
			},
		})
		let responseJson = undefined
		let errorJson = undefined

		if (response.ok) {
			responseJson = await response.json()
		} else {
			if (response.status === 400) {
				errorJson = await response.json()
			}
		}
		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson)
		})
	}

	async updateColor(color) {
		const settings = {
			color,
		}

		const response = await authFetch('http://localhost:5000/api/user/setting', {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(settings),
		})
		let responseJson = undefined
		let errorJson = undefined

		if (response.ok) {
			responseJson = await response.json()
		} else {
			if (response.status === 400) {
				errorJson = await response.json()
			}
		}
		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson)
		})
	}

	changeColor(color) {
		this.setState({ color: color })
		localStorage.setItem('color', color)
		this.updateColor(color)
			.then((response) => {
				console.log(response)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	getRoutes = (routes) => {
		return routes.map((prop, key) => {
			if (prop.layout === '/admin') {
				return <Route path={prop.layout + prop.path} component={prop.component} key={key} color={this.state.color} />
			} else {
				return null
			}
		})
	}

	getBrandText = (path) => {
		for (let i = 0; i < routes.length; i++) {
			if (this.props.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
				return routes[i].name
			}
		}
		return 'Brand'
	}
	render() {
		return (
			<>
				<Sidebar
					{...this.props}
					changeColor={this.changeColor}
					routes={routes}
					logo={{
						innerLink: '/admin/index',
						imgSrc: require('assets/img/brand/logo_brand_financial.png'),
						imgAlt: 'Logo',
					}}
				/>{' '}
				<StyleContext.Provider value={this.state.color}>
					<div className='main-content' ref='mainContent'>
						<AdminNavbar {...this.props} brandText={this.getBrandText(this.props.location.pathname)} />
						<Switch>
							{this.getRoutes(routes)}
							<Redirect from='*' to='/admin/index' />
						</Switch>
						<Container fluid>
							<AdminFooter />
						</Container>
					</div>
				</StyleContext.Provider>
			</>
		)
	}
}

export default Admin
