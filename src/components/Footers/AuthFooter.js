import React from 'react'
import { NavItem, NavLink, Nav, Container, Row, Col } from 'reactstrap'

class Login extends React.Component {
	render() {
		return (
			<>
				<footer className='py-5'>
					<Container>
						<Row className='align-items-center justify-content-xl-between'>
							<Col xl='6'>
								<div className='copyright text-center text-xl-left text-muted'>
									© 2020{' '}
									<a className='font-weight-bold ml-1' href='https://react-finance-application.herokuapp.com/'>
										Finance Dashboard
									</a>
								</div>
							</Col>
							<Col xl='6'>
								<Nav className='nav-footer justify-content-center justify-content-xl-end'>
									<NavItem>
										<NavLink href='https://templars.guru' target='_blank'>
											Templars.guru
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href='https://github.com/antoineratat/' target='_blank'>
											About Me
										</NavLink>
									</NavItem>
									<NavItem>
										<NavLink href='https://mit-license.org/' target='_blank'>
											MIT License
										</NavLink>
									</NavItem>
								</Nav>
							</Col>
						</Row>
					</Container>
				</footer>
			</>
		)
	}
}

export default Login
