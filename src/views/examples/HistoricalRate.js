import React, { Component } from 'react'
import { authFetch } from '../../auth'
import Select from 'react-dropdown-select'
import Pagination from 'react-js-pagination'
import UserHeader from 'components/Headers/UserHeader.js'
import BarLoader from 'react-spinners/BarLoader'
import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'
import sortDate from '../currency/utils/sortDate'
import fetchCurrency from 'views/currency/utils/fetchCurrency'
import fetchHistoryCurrency from '../currency/utils/fetchHistoryCurrency'
import { currenciesName } from '../currency/utils/currenciesName'
import { Button, Col, Form } from 'react-bootstrap'
import { Table, Card, CardHeader, FormGroup, Row, Container } from 'reactstrap'
import toastMessage from '../currency/utils/toastMessage'
import { Helmet } from 'react-helmet'

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

	componentDidUpdate(prevProps, prevState) {
		// handle first load, page one
		if (this.props.listCurrencyHistory !== prevProps.listCurrencyHistory) {
			this.handlePageChange(1)
		}

		if (this.props.stateFilterMethod !== prevProps.stateFilterMethod) {
			// handle filtermethod change even with pagination
			this.handlePageChange(this.state.activePage)
		}
	}

	shouldComponentUpdate(nextProps) {
		// Component should update if this.state.filterMethod is different than nextProps.filterMethod
		if (this.state.filterMethod !== nextProps.filterMethod) {
			return true
		}
		// Otherwise component shouldn't update
		return false
	}

	// --- CLASS METHODS ---

	handlePageChange(pageNumber) {
		const { listCurrencyHistory } = this.props
		const pageLimit = 13
		const offset = (pageNumber - 1) * pageLimit
		const currentItems = listCurrencyHistory.slice(offset, offset + pageLimit)
		this.setState({ activePage: pageNumber, currentItems: currentItems })
	}

	filterChild(filterMethod) {
		this.setState({ filterMethod: filterMethod })
		this.props.filter(filterMethod, filterMethod)
	}

	render() {
		const {
			listCurrencyHistory,
			listCurrencyHistoryLoaded,
			listCurrencyHistoryError,
			listCurrencyError,
			inputCurrency,
			handleClick,
			borderColor,
		} = this.props
		const { currentItems } = this.state

		if (listCurrencyHistoryError || listCurrencyError) {
			return (
				<>
					<div className='text-left justify-content-left ml-4'>
						<span style={{ fontSize: '0.80rem' }}>
							&nbsp;
							<br />
							<p className='mt-4 mb-2'>Impossible to fetch Historical Exchange Rate</p>
						</span>
						<Button style={{ backgroundColor: borderColor, borderColor: borderColor }} size='sm' className='mt-2 mb-4' onClick={handleClick}>
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

		if (!listCurrencyHistoryLoaded || this.state.currentItems === undefined) {
			return (
				<>
					<div className='text-center justify-content-center mb-4 mt-2'>
						<BarLoader
							css='display: flex; margin-top: 45px; justify-content: center; margin-left:auto; margin-right:auto;'
							color={'#2E3030'}
							size={5}
						/>
					</div>
				</>
			)
		} else {
			return (
				<>
					<Row className='text-left  ml-2 mt-md-0 mt-5'>
						<Col className='mt-3 justify-content-center'>
							<Pagination
								hideFirstLastPages
								pageRangeDisplayed={10}
								activePage={this.state.activePage}
								itemsCountPerPage={13}
								totalItemsCount={listCurrencyHistory.length}
								onChange={this.handlePageChange.bind(this)}
								itemClass='page-item'
								linkClass='page-link'
							/>
						</Col>
					</Row>
					<Table className='align-items-center table-flush table-hover mt-1' responsive>
						<thead className='thead-light'>
							<tr>
								<th scope='col'>
									<Button
										style={{
											backgroundColor: borderColor,
											borderColor: borderColor,
										}}
										className='btn-sm'
										onClick={() => this.filterChild('destAsc')}>
										Source Currency <i className='fas fa-sort'></i>
									</Button>
								</th>
								<th scope='col'>
									<Button
										style={{
											backgroundColor: borderColor,
											borderColor: borderColor,
										}}
										className='btn-sm'
										onClick={() => this.filterChild('destAsc')}>
										Destination Currency <i className='fas fa-sort'></i>
									</Button>
								</th>
								<th scope='col'>
									<Button
										style={{
											backgroundColor: borderColor,
											borderColor: borderColor,
										}}
										className='btn-sm'
										onClick={() => this.filterChild('rateAsc')}>
										Rate <i className='fas fa-sort'></i>
									</Button>
								</th>
								<th scope='col'>
									<Button
										style={{
											backgroundColor: borderColor,
											borderColor: borderColor,
										}}
										className='btn-sm'
										onClick={() => this.filterChild('histAsc')}>
										History <i className='fas fa-sort'></i>
									</Button>
								</th>
							</tr>
						</thead>
						<tbody>
							{currentItems.map((listCurrency, count) => {
								count++
								const rate = Math.round(listCurrency.rate * 1000) / 1000
								return (
									<tr key={count} className='card_news'>
										<td style={{ fontWeight: 600 }}>
											{listCurrency.baseCurrency} ({listCurrency.baseCurrencyLabel})
										</td>
										<td style={{ fontWeight: 600 }}>
											{listCurrency.destCurrency} ({listCurrency.destCurrencyLabel})
										</td>
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

// INFO: HISTORICAL EXCHANGE RATE
export default class HistoricalRate extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.filter = this.filter.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.state = {
			listCurrency: [],
			listCurrencyError: false,
			listCurrencyLoaded: false,
			listCurrencyHistory: [],
			listCurrencyHistoryError: false,
			listCurrencyHistoryLoaded: false,
			selectedCurrency: 'Default Currency',
			filterMethod: 'destAsc',
			search: '',
		}
	}
	// --- COMPONENT LIFECYCLE ---

	componentDidMount() {
		this.fetchUserSettings()
			.then((response) => {
				this.setState({ selectedCurrency: response.default_currency })
				fetchCurrency(response.default_currency)
					.then((response) => {
						const listCurrency = []
						for (const [prop, value] of Object.entries(response.rates)) {
							const currencyName = '(' + currenciesName[prop] + ')'
							listCurrency.push({
								value: prop,
								label: `${prop} ${currencyName}`,
								rate: value,
							})
						}
						const date = new Date(Date.now())
						const start_date = getDate(date)
						const end_date = getDateBefore(date, 1, 'months')
						this.getListExchange(start_date, end_date, this.state.selectedCurrency, listCurrency)
						this.setState({
							listCurrency: listCurrency,
							listCurrencyError: false,
							listCurrencyLoaded: true,
							listCurrencyHistoryError: false,
							listCurrencyHistoryLoaded: true,
						})
					})
					.catch((error) => {
						toastMessage('Impossible to load Historical Rate', 'error', 3500)
						this.setState({ listCurrencyError: true, listCurrencyHistoryError: true })
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				this.setState({ listCurrencyError: true, listCurrencyHistoryError: true, listCurrencyLoaded: true })
			})
	}

	// --- CLASS METHODS ---

	async fetchUserSettings() {
		const response = await authFetch('https://flask-finance-api.herokuapp.com/api/user/setting', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		let responseJson = undefined
		let errorJson = undefined

		if (response.ok) {
			responseJson = await response.json()
		} else {
			if (response.status === 400) {
				errorJson = await response.json()
			}
			if (response.status === 401) {
				errorJson = await response.json()
			}
		}
		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson.message)
		})
	}

	getListExchange(startDate, endDate, baseCurrency, listCurrency) {
		this.setState({ listCurrencyHistoryError: false, listCurrencyHistoryLoaded: false })
		const items = 33
		for (let i = 0; i < items - 1; i++) {
			const destCurrency = listCurrency[i]['value']
			if (destCurrency === baseCurrency) continue
			fetchHistoryCurrency(endDate, startDate, baseCurrency, destCurrency)
				.then((response) => {
					const orderedDates = sortDate(response)
					const historyPercentage = this.getHistoryPercentage(orderedDates, destCurrency)
					const keyEndDate = Object.keys(orderedDates)[orderedDates.length]
					const rate = orderedDates[keyEndDate][destCurrency]

					this.setState({
						listCurrencyHistory: [
							...this.state.listCurrencyHistory,
							{
								baseCurrency: baseCurrency,
								baseCurrencyLabel: currenciesName[baseCurrency],
								destCurrency: destCurrency,
								destCurrencyLabel: currenciesName[destCurrency],
								rate: rate,
								historyPercentage: historyPercentage,
							},
						],
					})
					if (this.state.listCurrencyHistory.length === items - 2) {
						this.setState({ listCurrencyHistoryLoaded: true })
					}
				})
				.catch((error) => {
					this.setState({ listCurrencyHistoryError: true })
				})
		}
	}

	getHistoryPercentage(orderedDates, destCurrency) {
		const orderedDatesKeys = Object.keys(orderedDates)
		const firstKey = orderedDatesKeys[0]
		const lastKey = orderedDatesKeys[orderedDatesKeys.length - 1]
		const t0 = orderedDates[firstKey][destCurrency]
		const t1 = orderedDates[lastKey][destCurrency]

		// Formula Historical Evolution % = ((t1 - t0) / t0) * 100
		let historyPercentage = ((t1 - t0) / t0) * 100
		historyPercentage = Math.round(historyPercentage * 10000) / 10000
		return historyPercentage
	}

	handleChange(selected) {
		selected && this.setState({ selectedCurrency: selected[0].value })
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.setState({ listCurrencyHistory: [] })
		this.getListExchange(start_date, end_date, selected[0].value, this.state.listCurrency)
		this.filter = this.filter.bind(this)
	}

	handleClick() {
		this.setState({ listCurrencyError: false, listCurrencyLoaded: false, listCurrencyHistoryError: false, listCurrencyHistoryLoaded: false })
		this.fetchUserSettings()
			.then((response) => {
				this.setState({ selectedCurrency: response.default_currency })
				fetchCurrency(response.default_currency)
					.then((response) => {
						toastMessage('Service Available', 'success', 3500)
						console.log(response)
						const listCurrency = []
						for (const [prop, value] of Object.entries(response.rates)) {
							const currencyName = '(' + currenciesName[prop] + ')'
							listCurrency.push({
								value: prop,
								label: `${prop} ${currencyName}`,
								rate: value,
							})
						}
						const date = new Date(Date.now())
						const start_date = getDate(date)
						const end_date = getDateBefore(date, 1, 'months')
						this.getListExchange(start_date, end_date, this.state.selectedCurrency, listCurrency)
						this.setState({
							listCurrency: listCurrency,
							listCurrencyError: false,
							listCurrencyLoaded: true,
							listCurrencyHistoryError: false,
							listCurrencyHistoryLoaded: true,
						})
					})
					.catch((error) => {
						toastMessage('Impossible to load Historical Rate', 'error', 3500)
						this.setState({ listCurrencyError: true, listCurrencyHistoryError: true })
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				this.setState({ listCurrencyError: true, listCurrencyHistoryError: true, listCurrencyLoaded: true })
			})
	}

	filter(filterMethod) {
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
		let {
			listCurrencyHistory,
			listCurrencyHistoryLoaded,
			listCurrencyHistoryError,
			listCurrency,
			listCurrencyLoaded,
			listCurrencyError,
			selectedCurrency,
		} = this.state
		const { color, borderColor } = this.props
		const welcome = 'Historical Exchange Rate'
		const message = 'Foreign Exchange Rates Historical Search.'
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')

		// INFO: listCurrencyHistory sortBy
		listCurrencyHistory = this.sortBy(this.state.filterMethod, listCurrencyHistory)

		// INFO: listCurrencyHistory search - if state.search filter the newsfeed array on conditional => string (title or description) include substring (state.search)
		if (this.state.search !== '') {
			listCurrencyHistory = listCurrencyHistory.filter(
				(newarr) =>
					newarr.destCurrency.toLowerCase().includes(this.state.search.toLowerCase()) ||
					newarr.destCurrencyLabel.toLowerCase().includes(this.state.search.toLowerCase())
			)
		}

		return (
			<div>
				<Helmet>
					<title>Financial - Historical Rate</title>
				</Helmet>
				<UserHeader welcome={welcome} message={message} color={color} />
				<Container className='mt--7' fluid>
					{/* User settings */}
					<Row>
						<Col lg='12' xl='3'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='align-items-center'>
										<div className='col'>
											<h5 className='text-uppercase text-muted mb-0 card-title'>
												Historical Exchange Rate {selectedCurrency && 'From ' + selectedCurrency}
											</h5>
											{selectedCurrency && (
												<p className='mt-1 mb-0 text-muted text-sm'>
													<span className='text-nowrap'>
														1M: {end_date} <i className='fa-xs fas fa-chevron-right'></i> {start_date}
													</span>
												</p>
											)}
										</div>
									</Row>

									<FormGroup className='mt-4'>
										<label className='form-control-label' htmlFor='input-username'>
											Select Currency
										</label>
										<Select
											key={new Date().getTime()}
											options={listCurrency}
											values={[
												{
													label: selectedCurrency + ' (' + currenciesName[selectedCurrency] + ')',
													value: selectedCurrency,
												},
											]}
											onChange={(selected) => this.handleChange(selected)}
											keepSelectedInList={true}
											dropdownHandle={true}
											closeOnSelect={true}
											clearable={false}
											loading={listCurrencyLoaded ? false : true}
											disabled={listCurrencyError ? true : false}
											style={{ borderRadius: '.25rem' }}
										/>
									</FormGroup>
								</CardHeader>
							</Card>
						</Col>
						<Col lg='12' xl='9' className='mt-4 mt-xl-0'>
							<Card className='shadow'>
								<Col xs={10} sm={7} md={6} lg={6} xl={6} className='mx-lg-1 mb-2'>
									{/* INFO: Form Filter */}
									<Form noValidate className='justify-content-left text-left ml-1 mt-4'>
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
									listCurrencyHistoryLoaded={listCurrencyHistoryLoaded}
									listCurrencyHistoryError={listCurrencyHistoryError}
									listCurrencyError={listCurrencyError}
									inputCurrency={selectedCurrency}
									handleClick={this.handleClick}
									filter={this.filter}
									stateFilterMethod={this.state.filterMethod}
									setState={this.setState}
									borderColor={borderColor}
								/>
							</Card>
						</Col>
					</Row>
				</Container>
			</div>
		)
	}
}
