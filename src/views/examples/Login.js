import React, { useState } from 'react'
import { login } from '../../auth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col, Row } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import toastMessage from '../currency/utils/toastMessage'
import { Helmet } from 'react-helmet'
import ClipLoader from 'react-spinners/ClipLoader'

export default function Login() {
	const history = useHistory()

	const [isDisabled, setIsDisabled] = useState(false)

	const regexPassword = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,24}$/
	const regexNoSpecial = /^[a-zA-Z. ]*$/
	const validationSchema = Yup.object({
		username: Yup.string()
			.min(6, 'Username too short')
			.max(20, 'Username too long')
			.matches(regexNoSpecial, "Username doesn't contain special characters")
			.required('Required'),
		password: Yup.string()
			.min(6, 'Password too short')
			.max(12, 'Password too long')
			.matches(regexPassword, 'Password should be a mix of 6 characters and numbers')
			.required('Required'),
	})

	const { handleSubmit, handleChange, handleBlur, values, touched, errors } = useFormik({
		initialValues: {
			username: '',
			password: '',
		},
		validationSchema,
		onSubmit(values) {
			handleLogin(values)
		},
	})

	async function requestLogin(username, password) {
		const user = { username, password }
		const response = await fetch('https://flask-finance-api.herokuapp.com/api/login', {
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

	function handleLogin(values) {
		setIsDisabled(true)
		const username = values.username.toLowerCase()
		const password = values.password
		requestLogin(username, password)
			.then((response) => {
				if (response.access_token) {
					login(response)
					const message = (
						<p>
							<i className='fas fa-user'></i>&nbsp;&nbsp;&nbsp;Logged in as <span style={{ fontWeight: 600 }}>{response.username}</span>
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
					history.push('/')
				}
			})
			.catch((error) => {
				toastMessage(error.message, 'error', 3500)
				setIsDisabled(false)
			})
	}

	return (
		<>
			<Helmet>
				<title>Financial - Login</title>
			</Helmet>
			<Col lg='5' md='7'>
				<Card className='bg-secondary shadow border-0'>
					<CardBody className='px-lg-5 py-lg-5'>
						<div className='text-center text-muted mb-4'>
							<small>Sign in with credentials</small>
						</div>
						<Form role='form' onSubmit={handleSubmit}>
							<FormGroup className='mb-3'>
								<InputGroup className='input-group-alternative'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-user-circle'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input
										id='username'
										name='username'
										type='text'
										placeholder='Username'
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
										type='password'
										placeholder='Password'
										onBlur={handleBlur}
										value={values.password}
										onChange={handleChange}
									/>
								</InputGroup>
								{errors.password && touched.password && <div className='error_field'>{errors.password}</div>}
							</FormGroup>
							<div className='text-center'>
								<Button className='mt-1 mb-4' color='primary' type='submit' disabled={isDisabled}>
									Sign in {isDisabled && <ClipLoader css='margin-bottom: -4%; margin-left: 5%' color={'white'} size={15} />}
								</Button>
							</div>
						</Form>
						<Row className='mt-3'>
							<Col className='text-right' xs='6'>
								<a className='text-light' href='#register' onClick={() => history.push('/auth/register')}>
									<small style={{ color: 'rgba(36, 91, 185, 1)' }}>Create Account</small>
								</a>
							</Col>
							<Col xs='6'>
								<a className='text-light' href='#forgot' onClick={() => history.push('/auth/forgot')}>
									<small style={{ color: 'rgba(36, 91, 185, 1)' }}>Forgot password?</small>
								</a>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</Col>
		</>
	)
}
