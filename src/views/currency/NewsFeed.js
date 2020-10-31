import React, { Component } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'

export default class NewsFeed extends Component {
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}
	handleClick() {
		this.props.getNewsFeed()
	}

	render() {
		let { newsFeed, newsFeedError, newsFeedLoaded } = this.props
		newsFeed = newsFeed.slice(0, 20)

		if (newsFeedError) {
			return (
				<>
					<div className='text-center justify-content-center'>
						<span>&nbsp;Impossible to fetch Finance News Feed</span>
					</div>
					<div className='text-center justify-content-center mt-2'>
						<Button size='sm' onClick={this.handleClick}>
							{' '}
							Try Again{' '}
						</Button>
					</div>
				</>
			)
		}

		if (!newsFeedLoaded) {
			return (
				<>
					<div className='text-center justify-content-center'>
						<BarLoader css='display: flex; justify-content: center; margin-left:auto; margin-right:auto;' color={'#2E3030'} size={5} />
					</div>
				</>
			)
		} else {
			return (
				<>
					{newsFeed.map((info) => {
						return (
							<Card className='card_news text-center justify-content-center mx-auto mb-1' style={{ width: '98%' }}>
								<Card.Body className='card_news_body'>
									<Row>
										<Col xs={2} sm={2} md={2} lg={2} xl={1} className='text-left justify-content-left mr-3 mr-xl-2'>
											<img src={info.source.imageUrls.thumb} alt={info.source.brandName} />
										</Col>
										<Col xs={8} sm={8} md={8} lg={8} xl={1} className='mb-2 text-left justify-content-left mr-xl-2'>
											<Row>
												<a href={`https://${info.source.name}`} style={{ fontSize: '0.7rem' }}>
													{info.source.brandName}
												</a>
											</Row>
											<Row style={{ fontSize: '0.7rem', marginTop: '-1%' }} className='text-muted '>
												{info.publishTime.slice(0, 10)}
											</Row>
										</Col>
										<Col xs={12} sm={12} md={12} lg={12} xl={8}>
											<Row className='text-left mx-auto justify-content-left'>
												<a style={{ color: 'black', fontSize: '0.8rem' }} href={info.url}>
													{info.title}
												</a>
											</Row>
											<Row className='text-left mx-auto justify-content-left' style={{ fontSize: '0.7rem' }}>
												{info.description}
											</Row>
										</Col>
									</Row>
								</Card.Body>
							</Card>
						)
					})}
				</>
			)
		}
	}
}
