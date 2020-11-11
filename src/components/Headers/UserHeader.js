import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import StyleContext from '../../views/examples/StyleContext'

class UserHeader extends React.Component {
	constructor(props) {
		super(props)
		this.state = { color: localStorage.color }
	}

	render() {
		const { welcome, message } = this.props

		return (
			<>
				<StyleContext.Consumer>
					{(color) => (
						<div
							className='header pb-8 pt-5 pt-lg-8 d-flex align-items-center'
							style={{
								minHeight: '150px',
								background: color,
								backgroundSize: 'cover',
								backgroundPosition: 'center top',
							}}>
							<span className='mask bg-gradient-default opacity-1' />
							<Container className='d-flex align-items-center' fluid>
								<Row>
									<Col lg='12' md='12'>
										<h1 className='display-2 text-white'>{welcome}</h1>
										<p className='text-white mt-0 mb-5'>{message}</p>
									</Col>
								</Row>
							</Container>
						</div>
					)}
				</StyleContext.Consumer>
			</>
		)
	}
}

export default UserHeader
