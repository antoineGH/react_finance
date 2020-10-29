import React, { Component } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { Table } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import getDate from './utils/getDate'

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
		newsFeed = newsFeed.slice(0, 50)
		console.log(newsFeed)

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
					<Table className='align-items-center table-flush' responsive>
						<col style={{ width: '5%' }} />
						<col style={{ width: '8%' }} />
						<col style={{ width: '62%' }} />
						<col style={{ width: '10%' }} />
						<col style={{ width: '15%' }} />
						<thead className='thead-light'>
							<tr>
								<th scope='col'></th>
								<th scope='col'>Date</th>
								<th scope='col'>Title</th>
								<th scope='col'>Article</th>
								<th scope='col'>Source</th>
							</tr>
						</thead>
						<tbody>
							{newsFeed.map((info) => {
								return (
									<tr>
										<td>
											<img src={info.source.imageUrls.thumb} alt={info.source.brandName} />
										</td>
										<td>{info.publishTime.slice(0, 10)}</td>
										<th scope='row' style={{ width: '16.66%' }}>
											{info.title}
										</th>
										<td>
											<a href={info.url}>Read More</a>
										</td>
										<td>
											<a href={`https://${info.source.name}`}>{info.source.brandName}</a>
										</td>
									</tr>
								)
							})}
							<tr>
								<td>
									<img src={newsFeed[0].source.imageUrls.thumb} alt={newsFeed[0].source.brandName} />
								</td>
								<td>{newsFeed[0].publishTime.slice(0, 10)}</td>
								<th scope='row' style={{ width: '16.66%' }}>
									{newsFeed[0].title}
								</th>
								<td>
									<a href={newsFeed[0].url}>Read More</a>
								</td>
								<td>
									<a href={`https://${newsFeed[0].source.name}`}>{newsFeed[0].source.brandName}</a>
								</td>
							</tr>
						</tbody>
					</Table>
				</>
			)
		}
	}
}
