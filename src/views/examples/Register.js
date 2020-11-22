import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import toastMessage from '../currency/utils/toastMessage'
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col, Row } from 'reactstrap'
import { Helmet } from 'react-helmet'
import ClipLoader from 'react-spinners/ClipLoader'

export default function Register() {
	const history = useHistory()

	const [isDisabled, setIsDisabled] = useState(false)

	const regexPassword = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,24}$/
	const regexNoSpecial = /^[a-zA-Z. ]*$/
	const validationSchema = Yup.object({
		username: Yup.string()
			.min(6, 'Username too short')
			.max(20, 'Username too long')
			.matches(regexNoSpecial, 'Username should not contain special characters')
			.required('Username Required'),
		email: Yup.string().min(6, 'Email too short').max(30, 'Email too long').email('Invalid email').required('Email Required'),
		password: Yup.string()
			.min(6, 'Password too short')
			.max(24, 'Password too long')
			.matches(regexPassword, 'Password should be a mix of 6 characters and numbers')
			.required('Password Required'),
		confirm_password: Yup.string()
			.min(6, 'Password too short')
			.max(24, 'Password too long')
			.oneOf([Yup.ref('password'), null], 'Passwords must match')
			.required('Password Required'),
		first_name: Yup.string()
			.min(2, 'First name too short')
			.max(12, 'First name too long')
			.matches(regexNoSpecial, 'Username should not contain special characters')
			.required('First name Required'),
		last_name: Yup.string()
			.min(2, 'Last name too short')
			.max(12, 'Last name too long')
			.matches(regexNoSpecial, 'Username should not contain special characters')
			.required('Last name Required'),
	})

	const { handleSubmit, handleChange, handleBlur, values, touched, errors } = useFormik({
		initialValues: {
			username: '',
			email: '',
			password: '',
			confirm_password: '',
			first_name: '',
			last_name: '',
		},
		validationSchema,
		onSubmit(values) {
			handleRegister(values)
		},
	})

	async function createUser(username, email, password, first_name, last_name) {
		const user = { username, email, password, first_name, last_name }
		user.key = username

		const response = await fetch('https://flask-finance-api.herokuapp.com/api/users', {
			method: 'POST',
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
			responseJson ? resolve(responseJson) : reject(errorJson)
		})
	}

	function handleRegister(values) {
		setIsDisabled(true)
		const username = values.username.toLowerCase()
		const email = values.email.toLowerCase()
		const password = values.password
		const first_name = values.first_name.toLowerCase()
		const last_name = values.last_name.toLowerCase()
		createUser(username, email, password, first_name, last_name)
			.then((response) => {
				const message = (
					<p>
						<i class='fas fa-user'></i>&nbsp;&nbsp;&nbsp;Successfully registered as <span style={{ fontWeight: 600 }}>{username}</span>
					</p>
				)
				toast.success(message, {
					className: 'Toastify__progress-bar_success',
					position: 'top-right',
					delay: 600,
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				})
				history.push('/auth/login')
			})
			.catch((error) => {
				toastMessage(error, 'error', 3500)
				setIsDisabled(false)
			})
	}

	return (
		<>
			<Helmet>
				<title>Financial - Register</title>
			</Helmet>
			<Col lg='6' md='8'>
				<Card className='bg-secondary shadow border-0'>
					<CardBody className='px-lg-5 py-lg-5'>
						<div className='text-center text-muted mb-4'>
							<small>Sign up with credentials</small>
						</div>
						<Form role='form' onSubmit={handleSubmit}>
							<FormGroup>
								<InputGroup className='input-group-alternative mb-3'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='far fa-id-card'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input
										id='first_name'
										name='first_name'
										placeholder='First Name'
										type='text'
										onBlur={handleBlur}
										value={values.first_name}
										onChange={handleChange}
									/>
								</InputGroup>
								{errors.first_name && touched.first_name && <div className='error_field'>{errors.first_name}</div>}
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative mb-3'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='far fa-id-card'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input
										id='last_name'
										name='last_name'
										placeholder='Last Name'
										type='text'
										onBlur={handleBlur}
										value={values.last_name}
										onChange={handleChange}
									/>
								</InputGroup>
								{errors.last_name && touched.last_name && <div className='error_field'>{errors.last_name}</div>}
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative mb-3'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-envelope'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input
										id='email'
										name='email'
										placeholder='Email'
										type='email'
										onBlur={handleBlur}
										value={values.email}
										onChange={handleChange}
									/>
								</InputGroup>
								{errors.email && touched.email && <div className='error_field'>{errors.email}</div>}
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative mb-3'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-user-circle'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input
										id='username'
										name='username'
										placeholder='Username'
										type='text'
										onBlur={handleBlur}
										value={values.username}
										onChange={handleChange}
									/>
								</InputGroup>
								{errors.username && touched.username && <div className='error_field'>{errors.username}</div>}
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-unlock-alt'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input
										id='password'
										name='password'
										placeholder='Password'
										type='password'
										onBlur={handleBlur}
										value={values.password}
										onChange={handleChange}
									/>
								</InputGroup>
								{errors.password && touched.password && <div className='error_field'>{errors.password}</div>}
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-unlock-alt'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input
										id='confirm_password'
										name='confirm_password'
										placeholder='Confirm Password'
										type='password'
										onBlur={handleBlur}
										value={values.confirmPassword}
										onChange={handleChange}
									/>
								</InputGroup>
								{errors.confirm_password && touched.confirm_password && <div className='error_field'>{errors.confirm_password}</div>}
							</FormGroup>
							<div className='text-center'>
								<Button className='mt-1 mb-3' color='primary' type='submit' disabled={isDisabled}>
									Sign Up {isDisabled && <ClipLoader css='margin-bottom: -4%; margin-left: 5%' color={'white'} size={15} />}
								</Button>
							</div>
						</Form>
						<Row className='mt-3'>
							<Col className='text-right' xs='6'>
								<a className='text-light' href='#login' onClick={() => history.push('/auth/login')}>
									<small style={{ color: 'rgba(83,103,125,0.75)' }}>
										Already have an account ? <span style={{ color: 'rgba(36, 91, 185, 1)' }}>Sign in</span>
									</small>
								</a>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</Col>
		</>
	)
}
