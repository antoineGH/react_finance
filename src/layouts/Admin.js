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
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import DarkModeToggle from 'react-dark-mode-toggle'

function getInitialTheme() {
	const savedTheme = localStorage.getItem('theme')
	return savedTheme ? JSON.parse(savedTheme) : { mode: 'light' }
}

const GlobalStyle = createGlobalStyle`
body {
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(22, 24, 25)'};
}
.bg-white {
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(19, 21, 22) !important'};
}

.navbar-light .navbar-nav .nav-link {
	color: ${(props) => props.theme.mode === 'dark' && 'rgba(237, 235, 232, 0.5) !important'};
}
.bg-light {
	background-color: ${(props) => props.theme.mode === 'dark' && '#111 !important'};
	color: ${(props) => props.theme.mode === 'dark' && '#EEE !important'};
}
.text-muted {
    color: ${(props) => props.theme.mode === 'dark' && 'rgb(168, 161, 148) !important'};
}
.navbar-light{
	background-color: ${(props) => (props.theme.mode === 'dark' ? '#111 !important' : '#EEE')};
	color: ${(props) => (props.theme.mode === 'dark' ? '#EEE !important' : '#111')};
}
.card {
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(19, 21, 22) !important'};
	color: ${(props) => props.theme.mode === 'dark' && 'rgb(168, 160, 148) !important'};
}

.card-header {
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(19, 21, 22) !important'};
	color: ${(props) => props.theme.mode === 'dark' && '#EEE !important'};
}

.form-control, .form-control:focus {
    color: ${(props) => props.theme.mode === 'dark' && 'rgb(184, 177, 168) !important'}; 
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(19, 21, 22) !important'};
	border-color: ${(props) => props.theme.mode === 'dark' && 'rgb(57, 62, 65) !important'};
}

.css-wmw4vi-ReactDropdownSelect {
    border-color: ${(props) => props.theme.mode === 'dark' && 'rgb(59, 65, 67) !important'};
}

.nav-pills .nav-link {
	color: ${(props) => props.theme.mode === 'dark' && 'rgb(143, 187, 230) !important'};
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(19, 21, 22)'};
}

.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    color: ${(props) => props.theme.mode === 'dark' && 'rgb(168, 184, 211) !important'};
}

.page-link {
    color: ${(props) => props.theme.mode === 'dark' && 'rgb(170, 162, 150)'};
    background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(19, 21, 22)'};
    border-color: ${(props) => props.theme.mode === 'dark' && 'rgb(52, 58, 60)'};
}

.page-link:hover {
    color: ${(props) => props.theme.mode === 'dark' && 'rgb(170, 162, 150)'};
    background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(36, 40, 41)'};
    border-color: ${(props) => props.theme.mode === 'dark' && 'rgb(52, 58, 60)'};
}

.page-item.active .page-link {
    color: ${(props) => props.theme.mode === 'dark' && 'rgb(170, 162, 150)'};
    background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(36, 40, 41)'};
    border-color: ${(props) => props.theme.mode === 'dark' && 'rgb(52, 58, 60)'};
}

.page-item.disabled .page-link  {
	color: ${(props) => props.theme.mode === 'dark' && 'rgb(170, 162, 150)'};
    background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(36, 40, 41)'};
    border-color: ${(props) => props.theme.mode === 'dark' && 'rgb(52, 58, 60)'};
}

.btn-primary {
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(66, 39, 90) !important'};
	border-color: ${(props) => props.theme.mode === 'dark' && 'rgb(66, 39, 90) !important'};
	color: ${(props) => props.theme.mode === 'dark' && 'white !important'};
}

.decoration-input {
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(66, 39, 90) !important'};
	border-color: ${(props) => props.theme.mode === 'dark' && 'rgb(66, 39, 90) !important'};
	color: ${(props) => props.theme.mode === 'dark' && 'white !important'};
}

.table .thead-light th {
    background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(19, 21, 22) !important'};
    color: ${(props) => props.theme.mode === 'dark' && 'rgb(237, 235, 232) !important'};
}

.table td, .table th {
	border-top-color: ${(props) => props.theme.mode === 'dark' && 'rgb(49, 55, 57) !important'};
	color: ${(props) => props.theme.mode === 'dark' && 'rgb(213, 209, 203) !important'}
}

a {
	color: ${(props) => props.theme.mode === 'dark' && 'rgb(117 111 101) !important'}
}

.text-username {
	color: ${(props) => props.theme.mode === 'dark' && 'white !important'}
}

.footer {
	background-color: ${(props) => props.theme.mode === 'dark' && 'rgb(22, 24, 25) !important'};
	color: ${(props) => props.theme.mode === 'dark' && '#EEE !important'};
}
`

class Admin extends React.Component {
	constructor(props) {
		super(props)
		this.changeColor = this.changeColor.bind(this)
		this.updateProfilePicture = this.updateProfilePicture.bind(this)
		this.state = {
			color: localStorage.color,
			backgroundColor: localStorage.backgroundColor,
			borderColor: localStorage.borderColor,
			pointBackgroundColor: localStorage.pointBackgroundColor,
			pointHoverBackgroundColor: localStorage.pointHoverBackgroundColor,
			profile_picture: '',
			theme: getInitialTheme,
		}
	}

	handleChangeTheme(toggle) {
		if (toggle) {
			this.setState({ theme: { mode: 'light' } })
		} else {
			this.setState({ theme: { mode: 'dark' } })
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
		const response = await authFetch('https://flask-finance-api.herokuapp.com/api/user/setting', {
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

		const response = await authFetch('https://flask-finance-api.herokuapp.com/api/user/setting', {
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
		setTimeout(() => {
			this.setState({
				color: themes[color].header,
				backgroundColor: themes[color].backgroundColor,
				borderColor: themes[color].borderColor,
				pointBackgroundColor: themes[color].pointBackgroundColor,
				pointHoverBackgroundColor: themes[color].pointHoverBackgroundColor,
			})
		}, 500)

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

	updateProfilePicture(url) {
		this.setState({ profile_picture: url })
		localStorage.setItem('profile_picture', url)
	}

	render() {
		return (
			<ThemeProvider theme={this.state.theme}>
				<GlobalStyle />
				<Sidebar
					{...this.props}
					profile_picture={this.state.profile_picture}
					routes={routes}
					logo={{
						innerLink: '/admin/index',
						imgSrc: require('assets/img/brand/logo_brand_financial.png'),
						imgAlt: 'Logo',
					}}
				/>{' '}
				<div className='main-content' ref='mainContent'>
					<AdminNavbar {...this.props} brandText={this.getBrandText(this.props.location.pathname)} profile_picture={this.state.profile_picture} />
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
							render={(props) => (
								<LoadUserSettings
									borderColor={this.state.borderColor}
									color={this.state.color}
									updateProfilePicture={this.updateProfilePicture}
									changeColor={this.changeColor}
									{...props}
								/>
							)}
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
					<DarkModeToggle
						onChange={(toggle) => this.handleChangeTheme(toggle)}
						checked={this.state.theme.mode === 'light' ? true : false}
						size={70}
					/>
					<Container fluid>
						<AdminFooter />
					</Container>
				</div>
			</ThemeProvider>
		)
	}
}

export default Admin
