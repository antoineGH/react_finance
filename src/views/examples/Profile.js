import React from 'react'

import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col } from 'reactstrap'

import UserHeader from 'components/Headers/UserHeader.js'

class Profile extends React.Component {
	render() {
		return (
			<>
				<UserHeader />
				{/* Page content */}
				<Container className='mt--7' fluid>
					<Row>
						<Col className='order-xl-2 mb-5 mb-xl-0' xl='4'>
							<Card className='card-profile shadow'>
								<Row className='justify-content-center'>
									<Col className='order-lg-2' lg='3'>
										<div className='card-profile-image'>
											<a href='#pablo' onClick={(e) => e.preventDefault()}>
												<img alt='...' className='rounded-circle' src={require('assets/img/theme/default.jpg')} />
											</a>
										</div>
									</Col>
								</Row>
								<br />
								<br />
								<br />
								<CardBody className='pt-0 pt-md-4 mt-5'>
									<div className='text-center mt-5'>
										<h3>
											First_name Last_name
											<span className='font-weight-light'>, Age</span>
										</h3>
										<div className='h5 font-weight-300'>
											<i className='ni location_pin mr-2' />
											Address, City, Postcode, Country
										</div>
										<div className='h5 mt-4'>
											<i className='ni business_briefcase-24 mr-2' />
											Position
										</div>
										<div>
											<i className='ni education_hat mr-2' />
											Education
										</div>
										<hr className='my-4' />
										<p>About Me</p>
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
											<Button color='primary' href='#pablo' onClick={(e) => e.preventDefault()} size='sm'>
												Update Profile
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
														<Input className='form-control-alternative' id='input-username' placeholder='Username' type='text' />
													</FormGroup>
												</Col>
												<Col lg='6'>
													<FormGroup>
														<label className='form-control-label' htmlFor='input-email'>
															Email address
														</label>
														<Input className='form-control-alternative' id='input-email' placeholder='Email' type='email' />
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
														<Input className='form-control-alternative' id='input-last-name' placeholder='Last name' type='text' />
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
														<Input className='form-control-alternative' id='input-address' placeholder='Home Address' type='text' />
													</FormGroup>
												</Col>
											</Row>
											<Row>
												<Col lg='4'>
													<FormGroup>
														<label className='form-control-label' htmlFor='input-city'>
															City
														</label>
														<Input className='form-control-alternative' id='input-city' placeholder='City' type='text' />
													</FormGroup>
												</Col>
												<Col lg='4'>
													<FormGroup>
														<label className='form-control-label' htmlFor='input-country'>
															Country
														</label>
														<Input className='form-control-alternative' id='input-country' placeholder='Country' type='text' />
													</FormGroup>
												</Col>
												<Col lg='4'>
													<FormGroup>
														<label className='form-control-label' htmlFor='input-country'>
															Postal code
														</label>
														<Input
															className='form-control-alternative'
															id='input-postal-code'
															placeholder='Postal code'
															type='number'
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
			</>
		)
	}
}

export default Profile
