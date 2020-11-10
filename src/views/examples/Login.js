import React, { useState } from 'react'
import { login } from '../../auth'
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col } from 'reactstrap'
import Modal from 'react-bootstrap/Modal'
import { useHistory } from 'react-router-dom'

export default function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [messageModal, setMessageModal] = useState('')
	const [iconModal, setIconModal] = useState('')
	const [smShow, setSmShow] = useState(false)
	const history = useHistory()

	async function requestLogin() {
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

	function handleClick(e) {
		requestLogin()
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
						<Form role='form'>
							<FormGroup className='mb-3'>
								<InputGroup className='input-group-alternative'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-user-circle'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} type='text' />
								</InputGroup>
							</FormGroup>
							<FormGroup>
								<InputGroup className='input-group-alternative'>
									<InputGroupAddon addonType='prepend'>
										<InputGroupText>
											<i className='fas fa-unlock-alt'></i>
										</InputGroupText>
									</InputGroupAddon>
									<Input placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
								</InputGroup>
							</FormGroup>
							<div className='custom-control custom-control-alternative custom-checkbox'>
								<input className='custom-control-input' id=' customCheckLogin' type='checkbox' />
								<label className='custom-control-label' htmlFor=' customCheckLogin'>
									<span className='text-muted'>Remember me</span>
								</label>
							</div>
							<div className='text-center'>
								<Button onClick={handleClick} className='my-4' color='primary' type='button'>
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
