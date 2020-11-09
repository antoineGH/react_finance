import React from 'react'
import { Link } from 'react-router-dom'
import { logout } from '../../auth'

import { DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Navbar, Nav, Container, Media } from 'reactstrap'

class AdminNavbar extends React.Component {
	disconnect() {
		console.log('disconnect')
		logout()
		localStorage.removeItem('username')
		window.location.reload()
	}

	render() {
		return (
			<>
				<Navbar className='navbar-top navbar-dark' expand='md' id='navbar-main'>
					<Container fluid>
						<Link className='h4 mb-0 text-white text-uppercase d-none d-lg-inline-block' to='/'>
							{this.props.brandText}
						</Link>
						<Nav className='align-items-center d-none d-md-flex' navbar>
							<UncontrolledDropdown nav>
								<DropdownToggle className='pr-0' nav>
									<Media className='align-items-center'>
										<span className='avatar avatar-sm rounded-circle'>
											<img
												alt='...'
												src={
													localStorage.username === 'antoine.ratat'
														? require('assets/img/theme/antoine.jpg')
														: require('assets/img/theme/default.jpg')
												}
											/>
										</span>
										<Media className='ml-2 d-none d-lg-block'>
											<span className='mb-0 text-sm font-weight-bold'>{localStorage.username}</span>
										</Media>
									</Media>
								</DropdownToggle>
								<DropdownMenu className='dropdown-menu-arrow' right>
									<DropdownItem to='/admin/user-profile' tag={Link}>
										<i className='ni ni-single-02' />
										<span>My profile</span>
									</DropdownItem>
									<DropdownItem to='/admin/user-profile' tag={Link}>
										<i className='ni ni-calendar-grid-58' />
										<span>My dashboard</span>
									</DropdownItem>
									<DropdownItem to='/admin/user-profile' tag={Link}>
										<i className='ni ni-support-16' />
										<span>Support</span>
									</DropdownItem>
									<DropdownItem divider />
									<DropdownItem onClick={this.disconnect}>
										<i className='ni ni-user-run' />
										<span>Logout</span>
									</DropdownItem>
								</DropdownMenu>
							</UncontrolledDropdown>
						</Nav>
					</Container>
				</Navbar>
			</>
		)
	}
}

export default AdminNavbar
