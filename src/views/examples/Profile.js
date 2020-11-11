import React, { useEffect, useState } from 'react'
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col } from 'reactstrap'
import UserHeader from 'components/Headers/UserHeader.js'
import { authFetch, logout } from '../../auth'
import moment from 'moment'
import Modal from 'react-bootstrap/Modal'
import { useHistory } from 'react-router-dom'

export default function Profile() {
	const [email, setEmail] = useState('')
	const [first_name, setFirstName] = useState('')
	const [last_name, setLastName] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [birthday, setBirthday] = useState('')
	const [age, setAge] = useState('')
	const [position, setPosition] = useState('')
	const [education, setEducation] = useState('')
	const [aboutMe, setAboutMe] = useState('')
	const [address, setAddress] = useState('')
	const [city, setCity] = useState('')
	const [postcode, setPostcode] = useState('')
	const [country, setCountry] = useState('')
	const [profilePicture, setProfilePicture] = useState('')

	const [messageModal, setMessageModal] = useState('')
	const [iconModal, setIconModal] = useState('')
	const [smShow, setSmShow] = useState(false)

	const [show, setShow] = useState(false)

	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)

	const history = useHistory()

	async function fetchUserInfo() {
		const response = await authFetch('http://localhost:5000/api/user', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
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
			if (response.status === 401) {
				errorJson = await response.json()
			}
		}
		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson.message)
		})
	}

	async function requestDelete() {
		const response = await authFetch('http://localhost:5000/api/user', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
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
			if (response.status === 401) {
				errorJson = await response.json()
			}
		}

		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson.message)
		})
	}

	async function requestUpdate() {
		const user = {
			username,
			email,
			password,
			first_name,
			last_name,
			birthday,
			position,
			education,
			aboutMe,
			address,
			city,
			postcode,
			country,
			profilePicture,
		}
		user.key = username

		const response = await authFetch('http://localhost:5000/api/user', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		})
		let responseJson = undefined
		let errorJson = undefined
		if (response.ok) {
			responseJson = await response.json()
		} else {
			if (response.status === 400) {
				errorJson = await response.json()
			}
			if (response.status === 401) {
				errorJson = await response.json()
			}
		}

		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson.message)
		})
	}

	useEffect(() => {
		let mounted = true
		fetchUserInfo()
			.then((response) => {
				if (mounted) {
					setEmail(response.user.email)
					setFirstName(toTitleCase(response.user.first_name))
					setLastName(toTitleCase(response.user.last_name))
					setUsername(response.user.username)
					setBirthday(response.user.birthdate)
					setAboutMe(response.user.about_me)
					setPosition(response.user.position)
					setEducation(response.user.education)
					setAddress(toTitleCase(response.user.address))
					setCity(toTitleCase(response.user.city))
					setPostcode(response.user.postcode)
					setCountry(toTitleCase(response.user.country))
					setProfilePicture(response.user.profile_picture)
					setAge(calculateAge(response.user.birthdate))
				}
			})
			.catch((error) => {})

		return function cleanup() {
			mounted = false
		}
	}, [])

	function handleClick(e) {
		requestUpdate()
			.then((response) => {
				setSmShow(true)
				setMessageModal(response.message)
				setIconModal(<i style={{ color: 'green' }} className='fas fa-check-circle'></i>)
				window.location.reload()
			})
			.catch((error) => {
				setSmShow(true)
				setMessageModal(error.message)
				setIconModal(<i style={{ color: 'red' }} className='fas fa-exclamation-circle'></i>)
			})
	}

	function deleteConfirmation() {
		handleShow()
	}

	function deleteUser(e) {
		e.preventDefault()
		requestDelete()
			.then((response) => {
				logout()
				localStorage.removeItem('username')
				setTimeout(() => {
					history.push('/auth/login')
				}, 750)
			})
			.catch((error) => {
				setSmShow(true)
				setMessageModal(error.message)
				setIconModal(<i style={{ color: 'red' }} className='fas fa-exclamation-circle'></i>)
			})
	}

	function calculateAge(birthdate) {
		const day = birthdate.slice(0, 2)
		const month = birthdate.slice(2, 4)
		const year = birthdate.slice(4, birthdate.length)
		birthdate = `${year}-${month}-${day}`
		return moment().diff(birthdate, 'years')
	}

	function toTitleCase(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(function (word) {
				return word.charAt(0).toUpperCase() + word.slice(1)
			})
			.join(' ')
	}

	const current_user = localStorage.username
	const welcome = `Hello ${first_name}.`
	const message = 'This is your profile page. You can see and edit your information.'
	const background = {
		color: 'linear-gradient(to right, #141e30, #243b55)',
	}
	return (
		<>
			<UserHeader welcome={welcome} message={message} background={background} />
			{/* Page content */}
			<Container className='mt--7' fluid>
				<Row>
					<Col className='order-xl-2 mb-5 mb-xl-0' xl='4'>
						<Card className='card-profile shadow'>
							<Row className='justify-content-center'>
								<Col className='order-lg-2' lg='3'>
									<div className='card-profile-image'>
										<img
											alt='...'
											className='rounded-circle'
											src={
												current_user === 'antoine.ratat'
													? require('assets/img/theme/antoine.jpg')
													: require('assets/img/theme/default.jpg')
											}
										/>
									</div>
								</Col>
							</Row>
							<br />
							<br />
							<br />
							<CardBody className='pt-0 pt-md-4 mt-5'>
								<div className='text-center mt-5'>
									<h3>
										{first_name !== '' ? first_name : 'First Name'} {last_name !== '' ? last_name : 'Last Name'}
										<span className='font-weight-light'>, {birthday !== '' ? age : 'Age'}</span>
									</h3>
									<div className='h5 font-weight-300'>
										<i className='ni location_pin mr-2' />
										{address !== '' ? address + ', ' : 'Address'} {city && city + ', '} {postcode && postcode + ', '}{' '}
										{country && country + '.'}
									</div>
									<div className='h5 mt-4'>
										<i className='ni business_briefcase-24 mr-2' />
										{position !== '' ? position : 'Position'}
									</div>
									<div>
										<i className='ni education_hat mr-2' />
										{education !== '' ? education : 'Education'}
									</div>
									<hr className='my-4' />
									{aboutMe}
								</div>
							</CardBody>
						</Card>
					</Col>

					<Col className='order-xl-1' xl='8'>
						<Card className='bg-secondary shadow'>
							<CardHeader className='bg-white border-0'>
								<Row className='align-items-center'>
									<Col xs='8'>
										<h3 className='mb-0'>My account</h3>
									</Col>
									<Col className='text-right' xs='4'>
										<Button color='primary' href='#pablo' onClick={handleClick} size='sm'>
											Update Profile
										</Button>
										<Button
											className='mt-xl-0 mr-xl-0 mt-lg-0 mt-1 mr-1'
											color='danger'
											href='#pablo'
											onClick={deleteConfirmation}
											size='sm'>
											Delete Account
										</Button>
									</Col>
								</Row>
							</CardHeader>
							<CardBody>
								<Form>
									<h6 className='heading-small text-muted mb-4'>User information</h6>
									<div className='pl-lg-4'>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-username'>
														Username
													</label>
													<Input
														readOnly
														value={username}
														onChange={(e) => setUsername(e.target.value)}
														className='form-control-alternative'
														id='input-username'
														placeholder='Username'
														type='text'
													/>
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-email'>
														Email address
													</label>
													<Input
														readOnly
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														className='form-control-alternative'
														id='input-email'
														placeholder='Email'
														type='email'
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-password'>
														Password
													</label>
													<Input
														value={password}
														onChange={(e) => setPassword(e.target.value)}
														className='form-control-alternative'
														id='input-password'
														placeholder='Password'
														type='password'
													/>
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-confirm-password'>
														Confirm Password
													</label>
													<Input
														value={confirmPassword}
														onChange={(e) => setConfirmPassword(e.target.value)}
														className='form-control-alternative'
														id='input-confirm-password'
														placeholder='Confirm Password'
														type='password'
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-first-name'>
														First name
													</label>
													<Input
														value={first_name}
														onChange={(e) => setFirstName(e.target.value)}
														className='form-control-alternative'
														id='input-first-name'
														placeholder='First name'
														type='text'
													/>
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-last-name'>
														Last name
													</label>
													<Input
														value={last_name}
														onChange={(e) => setLastName(e.target.value)}
														className='form-control-alternative'
														id='input-last-name'
														placeholder='Last name'
														type='text'
													/>
												</FormGroup>
											</Col>
										</Row>
									</div>
									<hr className='my-4' />
									{/* Personal Information */}
									<h6 className='heading-small text-muted mb-4'>Personal Information</h6>
									<div className='pl-lg-4'>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-position'>
														Position
													</label>
													<Input
														value={position}
														onChange={(e) => setPosition(e.target.value)}
														className='form-control-alternative'
														id='input-position'
														placeholder='Position'
														type='text'
													/>
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-education'>
														Education
													</label>
													<Input
														value={education}
														onChange={(e) => setEducation(e.target.value)}
														className='form-control-alternative'
														id='input-education'
														placeholder='Education'
														type='text'
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-birthday'>
														Birthday
													</label>
													<Input
														value={birthday}
														onChange={(e) => setBirthday(e.target.value)}
														className='form-control-alternative'
														id='input-birthday'
														placeholder='Birthday'
														type='text'
													/>
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-profilePicture'>
														Profile Picture
													</label>
													<Input
														value={profilePicture}
														onChange={(e) => setProfilePicture(e.target.value)}
														className='form-control-alternative'
														id='input-profilePicture'
														placeholder='Profile Picture'
														type='text'
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='12'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-aboutMee'>
														About Me
													</label>
													<Input
														style={{ resize: 'none', padding: '.50rem' }}
														type='textarea'
														rows={3}
														value={aboutMe}
														onChange={(e) => setAboutMe(e.target.value)}
														className='form-control-alternative'
														id='input-aboutMe'
														placeholder='About Me'
													/>
												</FormGroup>
											</Col>
										</Row>
									</div>
									<hr className='my-4' />
									{/* Address */}
									<h6 className='heading-small text-muted mb-4'>Contact information</h6>
									<div className='pl-lg-4'>
										<Row>
											<Col md='12'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-address'>
														Address
													</label>
													<Input
														value={address}
														onChange={(e) => setAddress(e.target.value)}
														className='form-control-alternative'
														id='input-address'
														placeholder='Home Address'
														type='text'
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='4'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-city'>
														City
													</label>
													<Input
														value={city}
														onChange={(e) => setCity(e.target.value)}
														className='form-control-alternative'
														id='input-city'
														placeholder='City'
														type='text'
													/>
												</FormGroup>
											</Col>
											<Col lg='4'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-country'>
														Postal code
													</label>
													<Input
														value={postcode}
														onChange={(e) => setPostcode(e.target.value)}
														className='form-control-alternative'
														id='input-postal-code'
														placeholder='Postal code'
														type='number'
													/>
												</FormGroup>
											</Col>
											<Col lg='4'>
												<FormGroup>
													<label className='form-control-label' htmlFor='input-country'>
														Country
													</label>
													<Input
														value={country}
														onChange={(e) => setCountry(e.target.value)}
														className='form-control-alternative'
														id='input-country'
														placeholder='Country'
														type='text'
													/>
												</FormGroup>
											</Col>
										</Row>
									</div>
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
			<Modal size='sm' show={smShow} onHide={() => setSmShow(false)} aria-labelledby='example-modal-sizes-title-sm'>
				<Modal.Header closeButton>
					<Modal.Title id='example-modal-sizes-title-sm'>
						{iconModal}
						{'  '}
						{messageModal}
					</Modal.Title>
				</Modal.Header>
			</Modal>

			<Modal size='sm' show={show} onHide={handleClose} aria-labelledby='example-modal-sizes-title-sm'>
				<Modal.Header closeButton>
					<Modal.Title id='example-modal-sizes-title-sm'>Confirm Account Deletion ?</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ marginTop: '-7%' }}>
					<Button variant='secondary' onClick={handleClose}>
						Cancel
					</Button>
					<Button color='danger' variant='primary' onClick={deleteUser}>
						Delete
					</Button>
				</Modal.Body>
			</Modal>
		</>
	)
}
