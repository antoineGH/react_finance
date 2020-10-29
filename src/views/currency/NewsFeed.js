import React, { Component } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { Table } from 'reactstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

export default class NewsFeed extends Component {
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}
	handleClick() {
		this.props.getNewsFeed()
	}

	render() {
		const { newsFeed, newsFeedError, newsFeedLoaded } = this.props

		if (newsFeedError) {
			return (
				<>
					<div className='text-center justify-content-center'>
						<span className='error_data'>
							<FontAwesomeIcon className='mt-1 mr-1' size='lg' icon={['fas', 'times']} />
							&nbsp;Impossible to fetch data, try again later.
						</span>
						<button onClick={this.handleClick}> Try Again </button>
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
						<thead className='thead-light'>
							<tr>
								<th scope='col'>Referral</th>
								<th scope='col'>Visitors</th>
								<th scope='col' />
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope='row'>Facebook</th>
								<td>1,480</td>
								<td></td>
							</tr>
						</tbody>
					</Table>
				</>
			)
		}
	}
}
