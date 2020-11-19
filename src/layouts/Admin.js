import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Container } from 'reactstrap'
import AdminNavbar from 'components/Navbars/AdminNavbar.js'
import AdminFooter from 'components/Footers/AdminFooter.js'
import Sidebar from 'components/Sidebar/Sidebar.js'
import routes from 'routes.js'
import { authFetch } from 'auth'
import { themes } from '../views/examples/Themes'
import Currency from '../views/currency/Currency'
import Convert from '../views/examples/Convert'
import RateGraph from '../views/examples/RateGraph'
import HistoricalGraph from '../views/examples/HistoricalGraph'
import HistoricalRate from '../views/examples/HistoricalRate'
import FinanceFeed from '../views/examples/FinanceFeed'
import LoadUserSettings from '../views/examples/LoadUserSettings'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import toastMessage from '../views/currency/utils/toastMessage'

class Admin extends React.Component {
	constructor(props) {
		super(props)
		this.changeColor = this.changeColor.bind(this)
		this.state = {
			color: localStorage.color,
			backgroundColor: localStorage.backgroundColor,
			borderColor: localStorage.borderColor,
			pointBackgroundColor: localStorage.pointBackgroundColor,
			pointHoverBackgroundColor: localStorage.pointHoverBackgroundColor,
		}
	}

	componentDidMount() {
		this.getColor()
			.then((response) => {
				this.setState({
					color: themes[response.style].header,
					backgroundColor: themes[response.style].backgroundColor,
					borderColor: themes[response.style].borderColor,
					pointBackgroundColor: themes[response.style].pointBackgroundColor,
					pointHoverBackgroundColor: themes[response.style].pointHoverBackgroundColor,
				})
			})
			.catch((error) => {
				toastMessage('Impossible to get Theme Color', 'error', 3500)
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
		this.setState({
			color: themes[color].header,
			backgroundColor: themes[color].backgroundColor,
			borderColor: themes[color].borderColor,
			pointBackgroundColor: themes[color].pointBackgroundColor,
			pointHoverBackgroundColor: themes[color].pointHoverBackgroundColor,
		})

		this.updateColor(color)
			.then((response) => {
				const message = (
					<p>
						<Button
							className='mb-1 squared_button'
							style={{
								background: themes[color].header,
								border: 0,
							}}></Button>
						&nbsp;&nbsp;&nbsp;Theme Changed to <span style={{ fontWeight: '600' }}>{color}</span>&nbsp;&nbsp;
					</p>
				)
				toast.success(message, {
					className: 'Toastify__progress-bar_success',
					position: 'top-right',
					autoClose: 3500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				})
			})
			.catch((error) => {
				toastMessage("Can't update Theme", 'error', 3500)
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
				<div className='main-content' ref='mainContent'>
					<AdminNavbar {...this.props} brandText={this.getBrandText(this.props.location.pathname)} />
					<Switch>
						<Route
							path='/admin/index'
							render={(props) => (
								<Currency
									color={this.state.color}
									backgroundColor={this.state.backgroundColor}
									borderColor={this.state.borderColor}
									pointBackgroundColor={this.state.pointBackgroundColor}
									pointHoverBackgroundColor={this.state.pointHoverBackgroundColor}
									{...props}
								/>
							)}
						/>
						<Route
							path='/admin/user-profile'
							render={(props) => <LoadUserSettings borderColor={this.state.borderColor} color={this.state.color} {...props} />}
						/>
						<Route path='/admin/convert' render={(props) => <Convert borderColor={this.state.borderColor} color={this.state.color} {...props} />} />
						<Route
							path='/admin/rate-graph'
							render={(props) => (
								<RateGraph
									backgroundColor={this.state.backgroundColor}
									borderColor={this.state.borderColor}
									color={this.state.color}
									pointBackgroundColor={this.state.pointBackgroundColor}
									pointHoverBackgroundColor={this.state.pointHoverBackgroundColor}
									{...props}
								/>
							)}
						/>
						<Route
							path='/admin/hist-graph'
							render={(props) => (
								<HistoricalGraph
									backgroundColor={this.state.backgroundColor}
									borderColor={this.state.borderColor}
									color={this.state.color}
									pointBackgroundColor={this.state.pointBackgroundColor}
									pointHoverBackgroundColor={this.state.pointHoverBackgroundColor}
									{...props}
								/>
							)}
						/>
						<Route
							path='/admin/hist-rate'
							render={(props) => <HistoricalRate borderColor={this.state.borderColor} color={this.state.color} {...props} />}
						/>
						<Route
							path='/admin/finance-feed'
							render={(props) => <FinanceFeed borderColor={this.state.borderColor} color={this.state.color} {...props} />}
						/>
						{this.getRoutes(routes)}
						<Redirect from='*' to='/admin/index' />
					</Switch>
					<Container fluid>
						<AdminFooter />
					</Container>
				</div>
			</>
		)
	}
}

export default Admin
