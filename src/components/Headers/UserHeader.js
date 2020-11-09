import React from 'react'
import { Container, Row, Col } from 'reactstrap'

class UserHeader extends React.Component {
	render() {
		return (
			<>
				<div
					className='header pb-8 pt-5 pt-lg-8 d-flex align-items-center'
					style={{
						minHeight: '150px',
						// backgroundImage: 'url(' + require('assets/img/theme/profile-cover.jpg') + ')',
						backgroundColor: '#22437f',
						backgroundSize: 'cover',
						backgroundPosition: 'center top',
					}}>
					<span className='mask bg-gradient-default opacity-1' />
					<Container className='d-flex align-items-center' fluid>
						<Row>
							<Col lg='12' md='12'>
								<h1 className='display-2 text-white'>Hello{this.props.first_name ? ' ' + this.props.first_name + '.' : '.'}</h1>
								<p className='text-white mt-0 mb-5'>This is your profile page. You can see and edit your information.</p>
							</Col>
						</Row>
					</Container>
				</div>
			</>
		)
	}
}

export default UserHeader
