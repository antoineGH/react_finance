import React, { useState } from 'react'
import { authFetch, logout } from '../../auth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Modal from 'react-bootstrap/Modal'
import { useHistory } from 'react-router-dom'
import Select from 'react-dropdown-select'
import { currenciesName } from '../currency/utils/currenciesName'
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	FormGroup,
	Form,
	Input,
	Container,
	Row,
	Col,
} from 'reactstrap'

export default function Profile(props) {
	const {
		username,
		first_name,
		last_name,
		email,
		birthday,
		age,
		position,
		education,
		aboutMe,
		address,
		city,
		postcode,
		country,
		profilePicture,
		current_user,
		selectedCurrencyProp,
		selectedDBCurrency,
		listCurrency,
		listCurrencyLoaded,
		listCurrencyError,
	} = props

	const [messageModal, setMessageModal] = useState('')
	const [iconModal, setIconModal] = useState('')
	const [smShow, setSmShow] = useState(false)
	const [show, setShow] = useState(false)
	const [selectedCurrency, setSelectedCurrency] = useState(selectedCurrencyProp)

	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)

	const history = useHistory()

	const regexChar = /^[a-zA-Z ]*$/
	const regexCharInteger = /^[A-Za-z0-9 ]*$/
	const regexPassword = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,24}$/
	const validationSchema = Yup.object({
		password: Yup.string()
			.min(6, 'Password too short')
			.max(24, 'Password too long')
			.matches(regexPassword, 'Password should be a mix of 6 characters and numbers'),
		confirm_password: Yup.string()
			.min(6, 'Password too short')
			.max(24, 'Password too long')
			.oneOf([Yup.ref('password'), null], 'Passwords must match'),
		first_name: Yup.string()
			.min(2, 'First name too short')
			.max(15, 'First name too long')
			.matches(regexChar, 'Username should not contain special characters or numbers')
			.required('First name Required'),
		last_name: Yup.string()
			.min(2, 'Last name too short')
			.max(15, 'Last name too long')
			.matches(regexChar, 'Username should not contain special characters or numbers')
			.required('Last name Required'),
		position: Yup.string()
			.min(2, 'Position too short')
			.max(50, 'Position too long')
			.matches(regexCharInteger, 'Position should not contain special characters'),
		education: Yup.string()
			.min(2, 'Education too short')
			.max(50, 'Education too long')
			.matches(regexCharInteger, 'Education should not contain special characters'),
		birthday: Yup.string().min(2, 'Last name too short').max(12, 'Last name too long'),
		about_me: Yup.string()
			.min(2, 'About Me too short')
			.max(120, 'About Me too long')
			.matches(regexCharInteger, 'About Me should not contain special characters'),
		address: Yup.string()
			.min(2, 'Address too short')
			.max(100, 'Address too long')
			.matches(regexCharInteger, 'Address should not contain special characters'),
		city: Yup.string()
			.min(2, 'City too short')
			.max(40, 'City too long')
			.matches(regexChar, 'City should not contain special characters or numbers'),
		postcode: Yup.number()
			.integer('Postcode not valid')
			.positive('Postcode not valid')
			.min(1, 'Postcode too short')
			.max(1000000, 'Postcode too long'),
		country: Yup.string()
			.min(2, 'Country too short')
			.max(15, 'Country too long')
			.matches(regexChar, 'Country should not contain special characters or numbers'),
	})

	const { handleSubmit, handleChange, handleBlur, values, touched, errors } = useFormik({
		initialValues: {
			username: username,
			email: email,
			password: '',
			confirm_password: '',
			first_name: first_name,
			last_name: last_name,
			position: position,
			education: education,
			birthday: birthday,
			about_me: aboutMe,
			address: address,
			city: city,
			postcode: postcode,
			country: country,
			profilePicture: profilePicture,
		},
		validationSchema,
		onSubmit(values) {
			handleUpdate(values)
		},
	})

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

	async function requestUpdate(
		password,
		first_name,
		last_name,
		position,
		education,
		birthday,
		aboutMe,
		address,
		city,
		postcode,
		country
	) {
		const user = {
			password,
			first_name,
			last_name,
			position,
			education,
			birthday,
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

	function handleUpdate(values) {
		const password = values.password
		const first_name = values.first_name
		const last_name = values.last_name
		const position = values.position
		const education = values.education
		const birthday = values.birthday
		const about_me = values.about_me
		const address = values.address
		const city = values.city
		const postcode = values.postcode
		const country = values.country

		if (selectedCurrency !== selectedDBCurrency) {
			updateCurrencyChange(selectedCurrency)
				.then((response) => {
					console.log(response)
				})
				.catch((error) => {
					console.log(error)
				})
		}
		requestUpdate(
			password,
			first_name,
			last_name,
			position,
			education,
			birthday,
			about_me,
			address,
			city,
			postcode,
			country
		)
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

	function handleChangeSelected(selected) {
		selected && setSelectedCurrency(selected[0].value)
		return
	}

	async function updateCurrencyChange(selectedCurrency) {
		const settings = { default_currency: selectedCurrency }

		const response = await authFetch('http://localhost:5000/api/user/setting', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
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
			if (response.status === 401) {
				errorJson = await response.json()
			}
		}

		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson.message)
		})
	}

	return (
		<>
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
										{first_name !== '' ? first_name : 'First Name'}{' '}
										{last_name !== '' ? last_name : 'Last Name'}
										<span className='font-weight-light'>
											, {birthday !== '' ? age : 'Age'}
										</span>
									</h3>
									<div className='h5 font-weight-300'>
										<i className='ni location_pin mr-2' />
										{address !== '' ? address + ', ' : 'Address'}{' '}
										{city && city + ', '} {postcode && postcode + ', '}{' '}
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
										<Button
											onClick={handleSubmit}
											color='primary'
											type='submit'
											size='sm'>
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
									{/* User settings */}
									<h6 className='heading-small text-muted mb-4'>User settings</h6>
									<div className='pl-lg-4'>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-username'>
														Default Currency
													</label>
													<Select
														key={new Date().getTime()}
														options={listCurrency}
														values={[
															{
																label:
																	selectedCurrency +
																	' (' +
																	currenciesName[
																		selectedCurrency
																	] +
																	')',
																value: selectedCurrency,
															},
														]}
														onChange={(selected) =>
															handleChangeSelected(selected)
														}
														keepSelectedInList={true}
														dropdownHandle={true}
														closeOnSelect={true}
														clearable={false}
														loading={listCurrencyLoaded ? true : false}
														disabled={listCurrencyError ? true : false}
														style={{ borderRadius: '.25rem' }}
													/>
												</FormGroup>
											</Col>
										</Row>
									</div>

									{/* User information */}
									<h6 className='heading-small text-muted mb-4'>
										User information
									</h6>
									<div className='pl-lg-4'>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-username'>
														Username
													</label>
													<Input
														readOnly
														value={username}
														className='form-control-input-profile'
														id='input-username'
														placeholder='Username'
														type='text'
													/>
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-email'>
														Email address
													</label>
													<Input
														readOnly
														value={email}
														className='form-control-input-profile'
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
													<label
														className='form-control-label'
														htmlFor='input-password'>
														Password
													</label>
													<Input
														id='password'
														name='password'
														placeholder='Password'
														type='password'
														onBlur={handleBlur}
														value={values.password}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.password && touched.password && (
														<div className='error_field_profile'>
															{errors.password}
														</div>
													)}
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-confirm-password'>
														Confirm Password
													</label>
													<Input
														id='confirm_password'
														name='confirm_password'
														placeholder='Confirm Password'
														type='password'
														onBlur={handleBlur}
														value={values.confirm_password}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.confirm_password &&
														touched.confirm_password && (
															<div className='error_field_profile'>
																{errors.confirm_password}
															</div>
														)}
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-first-name'>
														First name
													</label>
													<Input
														id='first_name'
														name='first_name'
														placeholder='First Name'
														type='text'
														onBlur={handleBlur}
														value={values.first_name}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.first_name && touched.first_name && (
														<div className='error_field_profile'>
															{errors.first_name}
														</div>
													)}
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-last-name'>
														Last name
													</label>
													<Input
														id='last_name'
														name='last_name'
														placeholder='Last Name'
														type='text'
														onBlur={handleBlur}
														value={values.last_name}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.last_name && touched.last_name && (
														<div className='error_field_profile'>
															{errors.last_name}
														</div>
													)}
												</FormGroup>
											</Col>
										</Row>
									</div>
									<hr className='my-4' />
									{/* Personal Information */}
									<h6 className='heading-small text-muted mb-4'>
										Personal Information
									</h6>
									<div className='pl-lg-4'>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-position'>
														Position
													</label>
													<Input
														id='position'
														name='position'
														placeholder='Position'
														type='text'
														onBlur={handleBlur}
														value={values.position}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.position && touched.position && (
														<div className='error_field_profile'>
															{errors.position}
														</div>
													)}
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-education'>
														Education
													</label>
													<Input
														id='education'
														name='education'
														placeholder='Education'
														type='text'
														onBlur={handleBlur}
														value={values.education}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.education && touched.education && (
														<div className='error_field_profile'>
															{errors.education}
														</div>
													)}
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-birthday'>
														Birthday
													</label>
													<Input
														id='birthday'
														name='birthday'
														placeholder='Birthday'
														type='text'
														onBlur={handleBlur}
														value={values.birthday}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.birthday && touched.birthday && (
														<div className='error_field_profile'>
															{errors.birthday}
														</div>
													)}
												</FormGroup>
											</Col>
											<Col lg='6'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-profilePicture'>
														Profile Picture
													</label>
													<Input
														id='profilePicture'
														name='profilePicture'
														placeholder='Profile Picture'
														type='text'
														onBlur={handleBlur}
														value={values.profilePicture}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='12'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-aboutMee'>
														About Me
													</label>
													<Input
														style={{
															resize: 'none',
															padding: '.50rem',
														}}
														id='about_me'
														name='about_me'
														placeholder='About Me'
														type='textarea'
														rows={3}
														onBlur={handleBlur}
														value={values.about_me}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.about_me && touched.about_me && (
														<div className='error_field_profile'>
															{errors.about_me}
														</div>
													)}
												</FormGroup>
											</Col>
										</Row>
									</div>
									<hr className='my-4' />
									{/* Address */}
									<h6 className='heading-small text-muted mb-4'>
										Contact information
									</h6>
									<div className='pl-lg-4'>
										<Row>
											<Col md='12'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-address'>
														Address
													</label>
													<Input
														id='address'
														name='address'
														placeholder='Address'
														type='text'
														onBlur={handleBlur}
														value={values.address}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.address && touched.address && (
														<div className='error_field_profile'>
															{errors.address}
														</div>
													)}
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg='4'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-city'>
														City
													</label>
													<Input
														id='city'
														name='city'
														placeholder='City'
														type='text'
														onBlur={handleBlur}
														value={values.city}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.city && touched.city && (
														<div className='error_field_profile'>
															{errors.city}
														</div>
													)}
												</FormGroup>
											</Col>
											<Col lg='4'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-country'>
														Postal code
													</label>
													<Input
														id='postcode'
														name='postcode'
														placeholder='Post Code'
														type='number'
														onBlur={handleBlur}
														value={values.postcode}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.postcode && touched.postcode && (
														<div className='error_field_profile'>
															{errors.postcode}
														</div>
													)}
												</FormGroup>
											</Col>
											<Col lg='4'>
												<FormGroup>
													<label
														className='form-control-label'
														htmlFor='input-country'>
														Country
													</label>
													<Input
														id='country'
														name='country'
														placeholder='Country'
														type='text'
														onBlur={handleBlur}
														value={values.country}
														onChange={handleChange}
														className='form-control-input-profile'
													/>
													{errors.country && touched.country && (
														<div className='error_field_profile'>
															{errors.country}
														</div>
													)}
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
			<Modal
				size='sm'
				show={smShow}
				onHide={() => setSmShow(false)}
				aria-labelledby='example-modal-sizes-title-sm'>
				<Modal.Header closeButton>
					<Modal.Title id='example-modal-sizes-title-sm'>
						{iconModal}
						{'  '}
						{messageModal}
					</Modal.Title>
				</Modal.Header>
			</Modal>

			<Modal
				size='sm'
				show={show}
				onHide={handleClose}
				aria-labelledby='example-modal-sizes-title-sm'>
				<Modal.Header closeButton>
					<Modal.Title id='example-modal-sizes-title-sm'>
						Confirm Account Deletion ?
					</Modal.Title>
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
