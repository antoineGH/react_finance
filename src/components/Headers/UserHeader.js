import React from 'react'
import { Container, Row, Col } from 'reactstrap'

class UserHeader extends React.Component {
	constructor(props) {
		super(props)
		this.state = { color: 'linear-gradient(to right, #141e30, #243b55)' }
	}

	// TODO: CHANGE BACKGROUND COLOR SHIT FOCUS FFS
	// TODO: Check state of useheader, try to change state onClick, then try to rerender on state change
	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.color !== localStorage.color) {
			console.log('should update!')
			if (localStorage.color) this.setState({ color: localStorage.color })
			this.forceUpdate()
			return true
		}
		return false
	}

	componentDidUpdate(prevProps, prevState) {
		console.log('component did update')
		if (localStorage.color) this.setState({ color: localStorage.color })
		if (prevState.color !== this.state.color) {
			console.log('DID UPDATE')
			this.forceUpdate()
		}
	}

	render() {
		const { welcome, message } = this.props

		// this.forceUpdate()

		return (
			<>
				<div
					className='header pb-8 pt-5 pt-lg-8 d-flex align-items-center'
					style={{
						minHeight: '150px',
						background: this.state.color,
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
			</>
		)
	}
}

export default UserHeader
