import React, { useState } from 'react'
import { login } from '../../auth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from 'reactstrap'
import Modal from 'react-bootstrap/Modal'
import { useHistory } from 'react-router-dom'

export default function Login() {
	const [messageModal, setMessageModal] = useState('')
	const [iconModal, setIconModal] = useState('')
	const [smShow, setSmShow] = useState(false)
	const history = useHistory()

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
		const response = await fetch('http://localhost:5000/api/login', {
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
		const username = values.username.toLowerCase()
		const password = values.password
		requestLogin(username, password)
			.then((response) => {
				if (response.access_token) {
					login(response)
					localStorage.setItem('username', response.username)
					localStorage.setItem('smShow', true)
					history.push('/')
				}
			})
			.catch((error) => {
				setSmShow(true)
				setMessageModal(error.message)
				setIconModal(<i style={{ color: 'red' }} className='fas fa-exclamation-circle'></i>)
			})
	}

	return (
		<>
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
								<Button className='my-4' color='primary' type='submit'>
									Sign in
								</Button>
							</div>
						</Form>
					</CardBody>
				</Card>
			</Col>
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
