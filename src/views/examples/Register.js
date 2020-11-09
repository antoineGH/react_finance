import React, { useState } from 'react'
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from 'reactstrap'
import Modal from 'react-bootstrap/Modal'
import { useHistory } from 'react-router-dom'

export default function Register() {
	const [email, setEmail] = useState('')
	const [first_name, setFirstName] = useState('')
	const [last_name, setLastName] = useState('')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [messageModal, setMessageModal] = useState('')
	const [iconModal, setIconModal] = useState('')
	const [smShow, setSmShow] = useState(false)
	const history = useHistory()

	async function createUser() {
		const user = { username, email, password, first_name, last_name }
		user.key = username

		const response = await fetch('http://localhost:5000/api/users', {
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

	function handleClick(e) {
		e.preventDefault()
		createUser()
			.then((response) => {
				setSmShow(true)
				setMessageModal('Successfully Registered')
				setIconModal(<i style={{ color: 'green' }} className='fas fa-check-circle'></i>)
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

	return (
		<>
			<Col lg='6' md='8'>
				<Card className='bg-secondary shadow border-0'>
					<CardBody className='px-lg-5 py-lg-5'>
						<div className='text-center text-muted mb-4'>
							<small>Sign up with credentials</small>
						</div>
						<Form role='form'>
							<FormGroup>
								<InputGroup className='input-group-alternative mb-3'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='far fa-id-card'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input placeholder='First Name' type='text' value={first_name} onChange={(e) => setFirstName(e.target.value)} />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative mb-3'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='far fa-id-card'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input placeholder='Last Name' type='text' value={last_name} onChange={(e) => setLastName(e.target.value)} />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative mb-3'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-envelope'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative mb-3'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-user-circle'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input placeholder='Username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-unlock-alt'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input placeholder='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-unlock-alt'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input
										placeholder='Confirm Password'
										type='password'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									/>
								</InputGroup>
							</FormGroup>
							<div className='text-center'>
								<Button onClick={handleClick} className='mt-4' color='primary' type='button'>
									Sign Up
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
