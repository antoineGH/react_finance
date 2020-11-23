import React, { useState } from 'react'
import { useFormik } from 'formik'
import { authFetch } from '../../auth'
import * as Yup from 'yup'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from 'reactstrap'
import { toast } from 'react-toastify'
import toastMessage from '../currency/utils/toastMessage'
import { Helmet } from 'react-helmet'
import ClipLoader from 'react-spinners/ClipLoader'
import { useParams } from 'react-router-dom'

export default function Reset() {
	const [isDisabled, setIsDisabled] = useState(false)
	const history = useHistory()
	let { token } = useParams()

	const regexPassword = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,24}$/
	const validationSchema = Yup.object({
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
	})

	const { handleSubmit, handleChange, handleBlur, values, touched, errors } = useFormik({
		initialValues: {
			password: '',
			confirm_password: '',
		},
		validationSchema,
		onSubmit(values) {
			setPassword(values)
		},
	})

	async function updatePassword(password) {
		const user = {
			password,
			token,
		}
		const response = await authFetch('http://localhost:5000/api/reset_password', {
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

	function setPassword(values) {
		setIsDisabled(true)
		const password = values.password
		updatePassword(password)
			.then((response) => {
				const message = (
					<p>
						<i className='fas fa-unlock-alt'></i>&nbsp;&nbsp;&nbsp;Password successfully reset{' '}
					</p>
				)
				toast.success(message, {
					className: 'Toastify__progress-bar_success',
					position: 'top-right',
					delay: 600,
					autoClose: 3500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				})
				setTimeout(() => {
					history.push('/auth/login')
				}, 3500)
			})
			.catch((error) => {
				toastMessage('Token is either invalid or expired', 'error', 3500)
				setIsDisabled(false)
			})
	}

	return (
		<>
			<Helmet>
				<title>Financial - Reset Password</title>
			</Helmet>
			<Col lg='5' md='7'>
				<Card className='bg-secondary shadow border-0'>
					<CardBody className='px-lg-5 py-lg-5'>
						<div className='text-center text-muted mb-4'>
							<small>Set you new password</small>
							{token && <p>{token}</p>}
						</div>
						<Form role='form' onSubmit={handleSubmit}>
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
								<Button className='mt-1 mb-4' color='primary' type='submit' disabled={isDisabled}>
									Reset Password
									{isDisabled && <ClipLoader css='margin-bottom: -2%; margin-left: 5%' color={'white'} size={15} />}
								</Button>
							</div>
						</Form>
					</CardBody>
				</Card>
			</Col>
		</>
	)
}
