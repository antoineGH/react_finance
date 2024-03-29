import React from 'react'
import { Link } from 'react-router-dom'
import { UncontrolledCollapse, Navbar, NavItem, NavLink, Nav, Container, Row, Col } from 'reactstrap'

class AdminNavbar extends React.Component {
	render() {
		return (
			<>
				<Navbar className='navbar-top navbar-horizontal navbar-dark' expand='md'>
					<Container className='px-4'>
						<button className='navbar-toggler' id='navbar-collapse-main'>
							<span className='navbar-toggler-icon' />
						</button>
						<UncontrolledCollapse navbar toggler='#navbar-collapse-main'>
							<div className='navbar-collapse-header d-md-none'>
								<Row>
									<Col className='collapse-brand' xs='6'>
										<Link to='/'>
											<img alt='...' src={require('assets/img/brand/logo_brand_financial.png')} />
										</Link>
									</Col>
									<Col className='collapse-close' xs='6'>
										<button className='navbar-toggler' id='navbar-collapse-main'>
											<span />
											<span />
										</button>
									</Col>
								</Row>
							</div>
							<Nav className='mx-auto' navbar>
								<NavItem>
									<NavLink className='nav-link-icon' to='/auth/register' tag={Link}>
										<i className='ni ni-circle-08' />
										<span className='nav-link-inner--text'>Sign Up</span>
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className='nav-link-icon' to='/auth/login' tag={Link}>
										<i className='fas fa-sign-in-alt'></i>
										<span className='nav-link-inner--text'>Sign In</span>
									</NavLink>
								</NavItem>
							</Nav>
						</UncontrolledCollapse>
					</Container>
				</Navbar>
			</>
		)
	}
}

export default AdminNavbar
