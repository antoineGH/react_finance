import React, { Component } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { Table } from 'reactstrap'
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
					{/* // TODO: Table to Card ? */}
					{/* xs = Extra small <576px
					sm = Small ≥576px
					md = Medium ≥768px
					lg = Large ≥992px
					xl = Extra large ≥1200px */}

					<Card className='text-left mx-auto' style={{ width: '98%' }}>
						<Card.Body>
							<Card.Text>
								<Row>
									<Col xs={12} sm={12} md={1} lg={3} xl={2}>
										<Row>
											<img src={newsFeed[0].source.imageUrls.thumb} alt={newsFeed[0].source.brandName} />
										</Row>
									</Col>
									<Col xs={12} sm={12} md={3} lg={3} xl={2}>
										<Row>
											<a href={`https://${newsFeed[0].source.name}`}>{newsFeed[0].source.brandName}</a>
										</Row>
										<Row style={{ fontSize: '0.7rem' }} className='text-muted'>
											{newsFeed[0].publishTime.slice(0, 10)}
										</Row>
									</Col>
									<Col xs={12} sm={12} md={6} lg={6} xl={8}>
										<Row>Article Title</Row>
										<Row>Article Description</Row>
									</Col>
								</Row>
							</Card.Text>
						</Card.Body>
					</Card>

					{/* <Table className='table-sm responsive'>
						<thead className='thead-light'>
							<tr>
								<th scope='col'></th>
								<th scope='col'>Source</th>
								<th scope='col'>Article</th>
							</tr>
						</thead>
						<tbody>
							{newsFeed.map((info, count) => {
								count++
								return (
									<tr key={count}>
										<td className='d-none d-md-block'>
											<img src={info.source.imageUrls.thumb} alt={info.source.brandName} />
										</td>
										<td>
											<Row className='d-none d-md-block'>
												<a href={`https://${info.source.name}`}>{info.source.brandName}</a>
											</Row>
											<Row className='d-none d-md-block' style={{ fontSize: '0.7rem' }}>
												{info.publishTime.slice(0, 10)}
											</Row>
										</td>
										<th scope='row'>
											<Row>
												<a style={{ color: 'black' }} href={info.url}>
													{info.title}
												</a>
											</Row>
											<Row style={{ fontSize: '0.7rem' }}>{info.description}</Row>
										</th>
									</tr>
								)
							})}
						</tbody>
					</Table> */}
				</>
			)
		}
	}
}
