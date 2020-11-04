import React, { Component } from 'react'

import getDate from './utils/getDate'
import getDateBefore from './utils/getDateBefore'

import BarLoader from 'react-spinners/BarLoader'
import { Table } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import { Card, CardHeader, Row } from 'reactstrap'

// INFO: LOAD FUNCTION
class LoadHistoricalExchangeRate extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.filter = this.props.filter.bind(this)
		this.state = {
			filterMethod: '',
		}
	}

	// --- COMPONENT LIFECYCLE ---
	shouldComponentUpdate(nextProps) {
		// Component should update if this.state.filterMethod is different than nextProps.filterMethod
		if (this.state.filterMethod !== nextProps.filterMethod) {
			return true
		}
		// Otherwise component shouldn't update
		return false
	}

	// --- CLASS METHODS ---
	filterChild(filterMethod) {
		this.setState({ filterMethod: filterMethod })
		this.props.filter(filterMethod, filterMethod)
	}
	render() {
		const { listCurrencyHistory, listCurrencyLoaded, listCurrencyError, inputCurrency, handleClick, stateFilterMethod } = this.props

		if (listCurrencyError) {
			return (
				<>
					<div className='text-center justify-content-center'>
						<span style={{ fontSize: '0.80rem' }}>&nbsp;Impossible to fetch Historical Exchange Rate</span>
					</div>
					<div className='text-center justify-content-center mt-2'>
						<Button size='sm' className='mt-2 mb-4' onClick={handleClick}>
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
					<Table className='align-items-center table-flush table-hover mt-3' responsive>
						<thead className='thead-light'>
							<tr>
								<th scope='col'>
									<Button className='btn-sm' onClick={() => this.filterChild('destAsc')}>
										Currency <i className='fas fa-sort'></i>
									</Button>
								</th>
								<th scope='col'>
									<Button className='btn-sm' onClick={() => this.filterChild('rateAsc')}>
										Rate <i className='fas fa-sort'></i>
									</Button>
								</th>
								<th scope='col'>
									<Button className='btn-sm' onClick={() => this.filterChild('histAsc')}>
										History <i className='fas fa-sort'></i>
									</Button>
								</th>
							</tr>
						</thead>
						<tbody>
							{listCurrencyHistory.map((listCurrency, count) => {
								count++
								const rate = Math.round(listCurrency.rate * 1000) / 1000
								return (
									<tr key={count} className='card_news'>
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

// INFO: HISTORICAL EXCHANGE RATE ARRAY
export default class HistoricalExchangeRate extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
		this.getListExchange = this.props.getListExchange.bind(this)
		this.setState = this.setState.bind(this)
		this.filter = this.filter.bind(this)
		this.state = {
			filterMethod: 'destAsc',
			search: '',
		}
	}

	// --- CLASS METHODS ---
	handleClick() {
		const { inputCurrency, listCurrency } = this.props
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.props.getListExchange(start_date, end_date, inputCurrency, listCurrency)
		this.filter = this.filter.bind(this)
	}

	filter(filterMethod) {
		//Toggle Functionnality
		if (this.state.filterMethod === filterMethod) {
			switch (filterMethod) {
				case 'destAsc':
					this.setState({ filterMethod: 'destDesc' })
					return
				case 'rateAsc':
					this.setState({ filterMethod: 'rateDesc' })
					return
				default:
					this.setState({ filterMethod: 'histDesc' })
					return
			}
		}
		this.setState({ filterMethod: filterMethod })
	}

	sortBy(filterMethod, listCurrencyHistory) {
		switch (filterMethod) {
			case 'destAsc':
				//Sort listCurrencyHistory by destCurrency ASC
				listCurrencyHistory.sort(function (a, b) {
					if (a.destCurrency > b.destCurrency) return 1
					if (a.destCurrency < b.destCurrency) return -1
					return 0
				})
				return listCurrencyHistory

			case 'destDesc':
				//Sort listCurrencyHistory by destCurrency DESC
				listCurrencyHistory.sort(function (a, b) {
					if (a.destCurrency > b.destCurrency) return -1
					if (a.destCurrency < b.destCurrency) return 1
					return 0
				})
				return listCurrencyHistory

			case 'rateAsc':
				//Sort listCurrencyHistory by rate ASC
				listCurrencyHistory.sort(function (a, b) {
					if (a.rate > b.rate) return 1
					if (a.rate < b.rate) return -1
					return 0
				})
				return listCurrencyHistory

			case 'rateDesc':
				//Sort listCurrencyHistory by rate DESC
				listCurrencyHistory.sort(function (a, b) {
					if (a.rate > b.rate) return -1
					if (a.rate < b.rate) return 1
					return 0
				})
				return listCurrencyHistory

			case 'histAsc':
				//Sort listCurrencyHistory by historyPercentage ASC
				listCurrencyHistory.sort(function (a, b) {
					if (a.historyPercentage > b.historyPercentage) return 1
					if (a.historyPercentage < b.historyPercentage) return -1
					return 0
				})
				return listCurrencyHistory

			default:
				//Sort listCurrencyHistory by historyPercentage DESC
				listCurrencyHistory.sort(function (a, b) {
					if (a.historyPercentage > b.historyPercentage) return -1
					if (a.historyPercentage < b.historyPercentage) return 1
					return 0
				})
				return listCurrencyHistory
		}
	}

	render() {
		let { listCurrencyHistory, listCurrencyLoaded, listCurrencyError, inputCurrency } = this.props
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')

		// INFO: listCurrencyHistory sortBy
		listCurrencyHistory = this.sortBy(this.state.filterMethod, listCurrencyHistory)

		// INFO: listCurrencyHistory search - if state.search filter the newsfeed array on conditional => string (title or description) include substring (state.search)
		if (this.state.search !== '') {
			listCurrencyHistory = listCurrencyHistory.filter((newarr) => newarr.destCurrency.toLowerCase().includes(this.state.search.toLowerCase()))
		}

		return (
			<Card className='shadow'>
				<CardHeader className='border-0'>
					<Row className='align-items-center'>
						<div className='col'>
							<h5 className='text-uppercase text-muted mb-0 card-title'>Historical Exchange Rate {inputCurrency && 'From ' + inputCurrency}</h5>
							{inputCurrency && (
								<p className='mt-1 mb-0 text-muted text-sm'>
									<span className='text-nowrap'>
										1M: {end_date} <i className='fa-xs fas fa-chevron-right'></i> {start_date}
									</span>
								</p>
							)}
						</div>
					</Row>
				</CardHeader>
				<Col xs={10} sm={7} md={6} lg={6} xl={8} className='mx-lg-1'>
					{/* INFO: Form Filter */}
					<Form noValidate className='justify-content-left text-left ml-1'>
						<div className='form-group has-search'>
							<span className='form-control-feedback'>
								<i className='fas fa-filter'></i>
							</span>
							<Form.Control
								className='form_filter'
								size='sm'
								type='text'
								id='search'
								placeholder='Filter Currencies'
								value={this.state.search}
								onChange={(e) => this.setState({ search: e.currentTarget.value })}
							/>
						</div>
					</Form>
				</Col>
				<LoadHistoricalExchangeRate
					listCurrencyHistory={listCurrencyHistory}
					listCurrencyLoaded={listCurrencyLoaded}
					listCurrencyError={listCurrencyError}
					inputCurrency={inputCurrency}
					handleClick={this.handleClick}
					filter={this.filter}
					stateFilterMethod={this.state.filterMethod}
					setState={this.setState}
				/>
			</Card>
		)
	}
}
