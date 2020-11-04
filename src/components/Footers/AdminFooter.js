import React from 'react'
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap'

class Footer extends React.Component {
	render() {
		return (
			<footer className='footer'>
				<Row className='align-items-center justify-content-xl-between'>
					<Col xl='6'>
						<div className='copyright text-center text-xl-left text-muted'>
							© 2020{' '}
							<a
								className='font-weight-bold ml-1'
								href='https://react-finance-application.herokuapp.com/'
								rel='noopener noreferrer'
								target='_blank'>
								Finance Dashboard
							</a>
						</div>
					</Col>

					<Col xl='6'>
						<Nav className='nav-footer justify-content-center justify-content-xl-end'>
							<NavItem>
								<NavLink href='https://templars.guru' rel='noopener noreferrer' target='_blank'>
									Templars.guru
								</NavLink>
							</NavItem>

							<NavItem>
								<NavLink href='https://github.com/antoineratat/' rel='noopener noreferrer' target='_blank'>
									About Me
								</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href='https://mit-license.org/' rel='noopener noreferrer' target='_blank'>
									MIT License
								</NavLink>
							</NavItem>
						</Nav>
					</Col>
				</Row>
			</footer>
		)
	}
}

export default Footer
