import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { logout } from '../../auth'
import { toast } from 'react-toastify'
import { DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Navbar, Nav, Container, Media } from 'reactstrap'

export default function AdminNavbar({ brandText, userInfo, profile_picture }) {
	const history = useHistory()

	function disconnect() {
		const message = (
			<p>
				<i className='fas fa-user'></i>&nbsp;&nbsp;&nbsp;Logged out
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
		logout()
		localStorage.removeItem('username')
		localStorage.removeItem('profile_picture')
		history.push('/auth/login')
	}

	return (
		<>
			<Navbar className='navbar-top navbar-dark' expand='md' id='navbar-main'>
				<Container fluid>
					<Link className='h4 mb-0 text-white text-uppercase d-none d-lg-inline-block' to='/'>
						{brandText}
					</Link>
					<Nav className='align-items-center d-none d-md-flex' navbar>
						<UncontrolledDropdown nav>
							<DropdownToggle className='pr-0' nav>
								<Media className='align-items-center'>
									<span className='avatar avatar-sm rounded-circle'>
										<img
											alt='...'
											src={
												profile_picture
													? profile_picture
													: localStorage.getItem('profile_picture')
													? localStorage.getItem('profile_picture')
													: userInfo.profile_picture === '' || userInfo.profile_picture === 'default.jpg'
													? require('assets/img/theme/default.jpg')
													: userInfo.profile_picture
											}
										/>
									</span>
									<Media className='ml-2 d-none d-lg-block'>
										<span className='mb-0 text-sm font-weight-bold'>{userInfo.username}</span>
									</Media>
								</Media>
							</DropdownToggle>
							<DropdownMenu className='dropdown-menu-arrow' right>
								<DropdownItem to='/admin/index' tag={Link}>
									<i className='ni ni-tv-2' />
									<span>My dashboard</span>
								</DropdownItem>
								<DropdownItem to='/admin/user-profile' tag={Link}>
									<i className='ni ni-single-02' />
									<span>My profile</span>
								</DropdownItem>
								<DropdownItem divider />
								<DropdownItem onClick={disconnect}>
									<i className='fas fa-sign-out-alt text-grey' />
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
