import React from 'react'
import { Container, Card, Button, CardBody, Col, Row } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import AuthFooter from 'components/Footers/AuthFooter.js'

export default function Error() {
	const history = useHistory()

	return (
		<>
			<div className='main-content'>
				<div className='header bg-gradient-info py-7 py-lg-8'>
					<Container>
						<div className='header-body text-center mb-7'>
							<Row className='justify-content-center'>
								<Col lg='5' md='6'>
									<h1 className='text-white'>Error 404</h1>
									<p className='text-lead text-light'>Our service is temporary unavailable.</p>
								</Col>
							</Row>
						</div>
					</Container>
					<div className='separator separator-bottom separator-skew zindex-100'>
						<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' version='1.1' viewBox='0 0 2560 100' x='0' y='0'>
							<polygon className='fill-default' points='2560 0 2560 100 0 100' />
						</svg>
					</div>
				</div>
				<div style={{ backgroundColor: '#172b4d' }}>
					{/* Page content */}
					<Container className='mt--8 pb-5'>
						<Row className='justify-content-center'>
							<Helmet>
								<title>Financial - Error 404</title>
							</Helmet>
							<Col lg='5' md='7'>
								<Card className='bg-secondary shadow border-0'>
									<CardBody className='px-lg-5 py-lg-5'>
										<div className='text-center text-muted mb-4'>
											<small>Please try again later</small>
										</div>

										<div className='text-center'>
											<Button className='mt-1 mb-4' color='primary' onClick={() => history.push('/')}>
												Try again
											</Button>
										</div>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
			<div style={{ backgroundColor: '#172b4d' }}>
				<AuthFooter />
			</div>
		</>
	)
}
