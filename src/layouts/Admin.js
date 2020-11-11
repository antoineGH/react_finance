import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Container } from 'reactstrap'
import AdminNavbar from 'components/Navbars/AdminNavbar.js'
import AdminFooter from 'components/Footers/AdminFooter.js'
import Sidebar from 'components/Sidebar/Sidebar.js'
import StyleContext from '../views/examples/StyleContext'

import routes from 'routes.js'

class Admin extends React.Component {
	constructor(props) {
		super(props)
		this.changeColor = this.changeColor.bind(this)
		this.state = {
			color: localStorage.color,
		}
	}
	componentDidUpdate(e) {
		document.documentElement.scrollTop = 0
		document.scrollingElement.scrollTop = 0
		this.refs.mainContent.scrollTop = 0
	}

	changeColor(color) {
		this.setState({ color: color })
		localStorage.setItem('color', color)
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
