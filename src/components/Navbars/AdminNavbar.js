import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { logout } from '../../auth'
import Modal from 'react-bootstrap/Modal'
import { DropdownMenu, DropdownItem, UncontrolledDropdown, DropdownToggle, Navbar, Nav, Container, Media } from 'reactstrap'

export default function AdminNavbar({ brandText }) {
	const [messageModal, setMessageModal] = useState('')
	const [iconModal, setIconModal] = useState('')
	const [smShow, setSmShow] = useState(false)
	const history = useHistory()

	function disconnect() {
		logout()
		localStorage.removeItem('username')
		setIconModal(<i style={{ color: 'green' }} className='fas fa-check-circle'></i>)
		setMessageModal('Successfully Logged out')
		setSmShow(true)
		setTimeout(() => {
			history.push('/auth/login')
		}, 750)
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
									<i className='ni ni-tv-2' />
									<span>My dashboard</span>
								</DropdownItem>
								<DropdownItem to='/admin/user-profile' tag={Link}>
									<i className='ni ni-single-02' />
									<span>My profile</span>
								</DropdownItem>
								<DropdownItem to='/admin/user-profile' tag={Link}>
									<i className='ni ni-support-16' />
									<span>Support</span>
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
			<Modal size='sm' show={smShow} onHide={() => setSmShow(false)} aria-labelledby='example-modal-sizes-title-sm'>
				<Modal.Header closeButton>
					<Modal.Title id='example-modal-sizes-title-sm'>
						{iconModal}
						{'  '}
						{messageModal}
					</Modal.Title>
				</Modal.Header>
			</Modal>
		</>
	)
}
