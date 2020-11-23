import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from 'reactstrap'
import { toast } from 'react-toastify'
import toastMessage from '../currency/utils/toastMessage'
import { Helmet } from 'react-helmet'
import ClipLoader from 'react-spinners/ClipLoader'

export default function Forgot() {
	const [seconds, setSeconds] = useState(0)
	const [isActive, setIsActive] = useState(false)

	const validationSchema = Yup.object({
		email: Yup.string().min(6, 'Email too short').max(30, 'Email too long').email('Invalid email').required('Email Required'),
	})

	const { handleSubmit, handleChange, handleBlur, values, touched, errors } = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema,
		onSubmit(values) {
			setSeconds(60)
			setIsActive(true)
			handleReset(values)
		},
	})

	useEffect(() => {
		let interval = null
		if (isActive) {
			interval = setInterval(() => {
				setSeconds((seconds) => seconds - 1)
			}, 1000)
			if (seconds === 0) {
				setIsActive(false)
			}
		} else if (!isActive && seconds !== 0) {
			clearInterval(interval)
		}
		return () => clearInterval(interval)
	}, [isActive, seconds])

	async function requestReset(email) {
		const response = await fetch('https://flask-finance-api.herokuapp.com/api/reset', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(email),
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

	function handleReset(values) {
		const email = values.email.toLowerCase()
		requestReset(email)
			.then((response) => {
				console.log(response)
				const message = (
					<p>
						<i className='fas fa-envelope'></i>&nbsp;&nbsp;&nbsp;Email successfully sent to <span style={{ fontWeight: 600 }}>{email}</span>
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
			})
			.catch((error) => {
				toastMessage(error.message, 'error', 3500)
			})
	}

	return (
		<>
			<Helmet>
				<title>Financial - Forgot Password</title>
			</Helmet>
			<Col lg='5' md='7'>
				<Card className='bg-secondary shadow border-0'>
					<CardBody className='px-lg-5 py-lg-5'>
						<div className='text-center text-muted mb-4'>
							<small>Enter your email to reset password</small>
						</div>
						<Form role='form' onSubmit={handleSubmit}>
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
							<div className='text-center'>
								<Button className='mt-1 mb-4' color='primary' type='submit' disabled={isActive}>
									Request reset {isActive && seconds !== 0 && seconds + 's'}{' '}
									{isActive && <ClipLoader css='margin-bottom: -2%; margin-left: 5%' color={'white'} size={15} />}
								</Button>
							</div>
						</Form>
					</CardBody>
				</Card>
			</Col>
		</>
	)
}
