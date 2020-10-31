import React, { Component } from 'react'

import getDate from './utils/getDate'
import getDateBefore from './utils/getDateBefore'

import BarLoader from 'react-spinners/BarLoader'
import { Table } from 'reactstrap'
import Button from 'react-bootstrap/Button'

export default class HistoricalExchangeRate extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
		this.getListExchange = this.props.getListExchange.bind(this)
	}

	// --- CLASS METHODS ---
	handleClick() {
		const { inputCurrency, listCurrency } = this.props
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.props.getListExchange(start_date, end_date, inputCurrency, listCurrency)
	}

	render() {
		let { listCurrencyHistory, listCurrencyLoaded, listCurrencyError, inputCurrency } = this.props

		if (listCurrencyError) {
			return (
				<>
					<div className='text-center justify-content-center'>
						<span style={{ fontSize: '0.80rem' }}>&nbsp;Impossible to fetch Historical Exchange Rate</span>
					</div>
					<div className='text-center justify-content-center mt-2'>
						<Button size='sm' className='mt-2 mb-4' onClick={this.handleClick}>
							{' '}
							Try Again{' '}
						</Button>
					</div>
				</>
			)
		}

		if (inputCurrency === '') {
			return (
				<>
					<div className='mb-4 text-center justify-content-center'>
						<span style={{ fontSize: '0.80rem' }}>&nbsp;Please select currency</span>
					</div>
				</>
			)
		}

		if (!listCurrencyLoaded) {
			return (
				<>
					<div className='text-center justify-content-center mb-4'>
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
								<th scope='col'>Dest</th>
								<th scope='col'>Rate</th>
								<th scope='col'>Hist</th>
							</tr>
						</thead>
						<tbody>
							{listCurrencyHistory.map((listCurrency, count) => {
								count++
								const rate = Math.round(listCurrency.rate * 1000) / 1000
								return (
									<tr key={count}>
										<td style={{ fontWeight: 600 }}>{listCurrency.destCurrency}</td>
										<td>{rate}</td>
										<td>
											{listCurrency.historyPercentage >= 0 ? (
												<i className='fas fa-arrow-up text-success mr-3' />
											) : (
												<i className='fas fa-arrow-down text-danger mr-3' />
											)}{' '}
											{listCurrency.historyPercentage}%
										</td>
									</tr>
								)
							})}
						</tbody>
					</Table>
				</>
			)
		}
	}
}
