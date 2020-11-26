import React, { Component } from 'react'
import { authFetch } from '../../auth'
import Select from 'react-dropdown-select'
import BarLoader from 'react-spinners/BarLoader'
import UserHeader from 'components/Headers/UserHeader.js'
import BarGraph from '../graph/BarGraph'
import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'
import fetchCurrency from '../currency/utils/fetchCurrency'
import fetchHistoryCurrency from '../currency/utils/fetchHistoryCurrency'
import sortDate from '../currency/utils/sortDate'
import getMonth from '../currency/utils/getMonth'
import { currenciesName } from '../currency/utils/currenciesName'
import { Button } from 'react-bootstrap'
import { Col, Card, CardHeader, FormGroup, Row, Container, CardBody } from 'reactstrap'
import toastMessage from '../currency/utils/toastMessage'
import { Helmet } from 'react-helmet'

// INFO: HISTORICAL GRAPH
export default class HistoricalGraph extends Component {
	// --- CLASS CONSTRUCTOR ---

	constructor(props) {
		super(props)
		this.handleReload = this.handleReload.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.state = {
			listCurrency: [],
			listCurrencyError: false,
			listCurrencyLoaded: false,
			selectedSourceCurrency: 'Default Currency',
			selectedDestCurrency: 'EUR',
			graphLoaded: false,
			graphError: false,
			graphHistoryValue: {},
			graphHistoryDates: {},
			graphTitle: {},
			style: {},
			active: '1M',
			reload: false,
		}
	}

	// --- COMPONENT LIFECYCLE ---

	componentDidMount() {
		this.fetchUserSettings()
			.then((response) => {
				const date = new Date(Date.now())
				const start_date = getDate(date)
				const end_date = getDateBefore(date, 1, 'months')
				const graphTitle = {
					base: this.state.selectedSourceCurrency,
					dest: this.state.selectedDestCurrency,
					start_at: start_date,
					end_at: end_date,
				}
				this.setState({
					selectedSourceCurrency: response.default_currency,
					graphTitle: graphTitle,
				})
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
						this.setState({
							listCurrency: listCurrency,
							listCurrencyLoaded: true,
							listCurrencyError: false,
						})

						this.getHistoryGraphInfo(end_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
					})
					.catch((error) => {
						toastMessage('Impossible to load Historical Graph', 'error', 3500)
						this.setState({ listCurrencyError: true })
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				this.setState({ listCurrencyError: true, graphError: true, listCurrencyLoaded: true })
			})
		this.createMockData()
	}

	static getDerivedStateFromProps(props) {
		return {
			backgroundColor: props.backgroundColor,
			borderColor: props.borderColor,
			pointBackgroundColor: props.pointBackgroundColor,
			pointHoverBackgroundColor: props.pointHoverBackgroundColor,
		}
	}

	componentDidUpdate() {
		if (this.state.reloaded) {
			this.setState({ reloaded: false })
			return true
		}
		return false
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

	getHistoryGraphInfo(endDate, baseCurrency, destCurrency) {
		const graphHistoryDates = []
		const graphHistoryValue = []
		const graphHistoryLegend = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

		// Array with date interval of 1 month from endDate to graphHistoryLegend.length (12 months)
		for (let i = 0; i <= graphHistoryLegend.length; i++) {
			graphHistoryDates.push(endDate)
			endDate = getDateBefore(endDate, 1, 'months')
		}

		const graphHistoryDateLegend = []
		graphHistoryDates.forEach((date) => {
			const month = getMonth(date)
			graphHistoryDateLegend.push(month)
		})
		graphHistoryDateLegend.reverse()
		graphHistoryDateLegend.shift()
		this.setState({ graphHistoryDates: graphHistoryDateLegend })

		// While we have more than 2 values in the Array, get last elements in Array and its previous to fetchHistoryCurrency
		while (graphHistoryDates.length >= 2) {
			const startDate = graphHistoryDates[graphHistoryDates.length - 1]
			const endDate = graphHistoryDates[graphHistoryDates.length - 2]
			fetchHistoryCurrency(startDate, endDate, baseCurrency, destCurrency)
				.then((response) => {
					const orderedDates = sortDate(response)
					const historyPercentage = this.getHistoryPercentage(orderedDates, destCurrency)
					graphHistoryValue.push(historyPercentage)
				})
				.catch((error) => {
					this.setState({ hasGraphHistoryError: true })
				})
			graphHistoryDates.pop()
		}
		this.setState({
			graphHistoryValue: graphHistoryValue,
			graphLoaded: true,
			graphError: false,
		})
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

	handleChangeSource(selected) {
		selected && this.setState({ selectedSourceCurrency: selected[0].value, active: '1M' })
		const date = new Date(Date.now())
		const end_date = getDateBefore(date, 1, 'month')
		this.getHistoryGraphInfo(end_date, selected[0].value, this.state.selectedDestCurrency)
	}

	handleChangeDestination(selected) {
		selected && this.setState({ selectedDestCurrency: selected[0].value, active: '1M' })
		const date = new Date(Date.now())
		const end_date = getDateBefore(date, 1, 'month')
		this.getHistoryGraphInfo(end_date, this.state.selectedSourceCurrency, selected[0].value)
	}

	createMockData() {
		const currency_style = {
			borderColor: 'rgb(255, 93, 93)',
			backgroundColor: 'rgba(255, 10, 13, 0.1)',
			pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 93, 93)',
			pointHoverRadius: 8,

			pointHoverBackgroundColor: 'rgb(255, 93, 93)',
			maxTicksLimit: 8,
		}
		this.setState({ style: currency_style })
	}

	handleReload() {
		const reload = !this.state.reload
		this.setState({ reload: reload })
	}

	handleClick() {
		this.setState({ graphError: false, graphLoaded: false, listCurrencyLoaded: false })
		this.fetchUserSettings()
			.then((response) => {
				const date = new Date(Date.now())
				const start_date = getDate(date)
				const end_date = getDateBefore(date, 1, 'months')
				const graphTitle = {
					base: this.state.selectedSourceCurrency,
					dest: this.state.selectedDestCurrency,
					start_at: start_date,
					end_at: end_date,
				}
				this.setState({
					selectedSourceCurrency: response.default_currency,
					graphTitle: graphTitle,
				})
				fetchCurrency(response.default_currency)
					.then((response) => {
						toastMessage('Service Available', 'success', 3500)
						const listCurrency = []
						for (const [prop, value] of Object.entries(response.rates)) {
							const currencyName = '(' + currenciesName[prop] + ')'
							listCurrency.push({
								value: prop,
								label: `${prop} ${currencyName}`,
								rate: value,
							})
						}
						this.setState({
							listCurrency: listCurrency,
							listCurrencyLoaded: true,
							listCurrencyError: false,
						})

						this.getHistoryGraphInfo(end_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
					})
					.catch((error) => {
						toastMessage('Impossible to load Historical Graph', 'error', 3500)
						this.setState({ listCurrencyError: true })
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				this.setState({ graphError: true, listCurrencyLoaded: true })
			})
		this.createMockData()
	}

	render() {
		const { color, backgroundColor, borderColor, pointBackgroundColor, pointHoverBackgroundColor } = this.props
		const {
			graphLoaded,
			graphError,
			graphHistoryValue,
			graphHistoryDates,
			graphTitle,
			listCurrency,
			listCurrencyError,
			listCurrencyLoaded,
			selectedSourceCurrency,
			selectedDestCurrency,
			style,
		} = this.state

		const welcome = 'Historical Exchange Rate Graph'
		const message = 'Historical Foreign Exchange Rates Graph based on current values from around the world.'
		return (
			<div>
				<Helmet>
					<title>Financial - Historical Graph</title>
				</Helmet>
				<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
				<Container className='mt--7' fluid>
					<Row className='justify-content-center justify-content-lg-start'>
						{/* User settings */}
						<Row style={{ width: '100%' }}>
							<Col lg='12' xl='3'>
								<Card className='shadow'>
									<CardHeader className='border-0'>
										<Row className='align-items-center'>
											<div className='col'>
												<h5 className='text-uppercase text-muted mb-0 card-title'>
													Historical Rate Graph{' '}
													{selectedSourceCurrency &&
														selectedDestCurrency &&
														'(' + selectedSourceCurrency + ' - ' + selectedDestCurrency + ')'}
												</h5>
											</div>
										</Row>

										<FormGroup className='mt-4'>
											<label className='form-control-label' htmlFor='input-username'>
												Select Source Currency
											</label>
											<Select
												key={new Date().getTime()}
												options={listCurrency}
												values={[
													{
														label: selectedSourceCurrency + ' (' + currenciesName[selectedSourceCurrency] + ')',
														value: selectedSourceCurrency,
													},
												]}
												onChange={(selected) => this.handleChangeSource(selected)}
												keepSelectedInList={true}
												dropdownHandle={true}
												closeOnSelect={true}
												clearable={false}
												loading={listCurrencyLoaded ? false : true}
												disabled={listCurrencyError ? true : false}
												style={{ borderRadius: '.25rem' }}
											/>
										</FormGroup>

										<FormGroup className='mt-4'>
											<label className='form-control-label' htmlFor='input-username'>
												Select Destination Currency
											</label>
											<Select
												key={new Date().getTime()}
												options={listCurrency}
												values={[
													{
														label: selectedDestCurrency + ' (' + currenciesName[selectedDestCurrency] + ')',
														value: selectedDestCurrency,
													},
												]}
												onChange={(selected) => this.handleChangeDestination(selected)}
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
							<Col className='mb-5 mb-xl-0 mt-4 mt-xl-0' xl='9'>
								{selectedSourceCurrency && selectedDestCurrency && graphLoaded && !graphError ? (
									<Card className='shadow'>
										<CardHeader className='bg-transparent'>
											<Row className='align-items-center'>
												<div className='col'>
													<h5 className='text-uppercase text-muted mb-0 card-title'>
														Historical Exchange Rate ({graphTitle.base} - {graphTitle.dest})
													</h5>
													<p className='mt-1 mb-0 text-muted text-sm'>
														<span className='text-nowrap'>
															1Y: {getDateBefore(graphTitle.end_at, 1, 'years')} <i className='fa-xs fas fa-chevron-right'></i>{' '}
															{graphTitle.end_at}
														</span>
													</p>
													<span style={{ fontSize: '0.80rem' }}></span>
												</div>
											</Row>
											<div
												className='text-right col-12'
												style={{
													marginTop: '-3%',
													marginBottom: '2%',
												}}>
												<Button
													style={{
														backgroundColor: this.props.borderColor,
														borderColor: this.props.borderColor,
														color: 'white',
													}}
													size='sm'
													onClick={this.handleReload}>
													<i className='fas fa-sync-alt'></i>
												</Button>
											</div>
										</CardHeader>
										<CardBody>
											{/* Chart */}
											<div className='chart'>
												<BarGraph
													graphValues={graphHistoryValue}
													graphLegend={graphHistoryDates}
													style={style}
													backgroundColor={backgroundColor}
													borderColor={borderColor}
													pointBackgroundColor={pointBackgroundColor}
													pointHoverBackgroundColor={pointHoverBackgroundColor}
													reload={this.state.reload}
												/>
											</div>
										</CardBody>
									</Card>
								) : (
									<Card className='shadow'>
										<CardHeader className='bg-transparent'>
											<Row className='align-items-center'>
												<div className='col'>
													<h5 className='text-uppercase text-muted mb-0 card-title'>Historical Exchange Rate</h5>
													<span style={{ fontSize: '0.80rem' }}></span>
												</div>
											</Row>
											{graphError && (
												<>
													<div className='text-left justify-content-left'>
														<span style={{ fontSize: '0.80rem' }}>
															&nbsp;
															<br />
															<p className='mt-1 mb-2'>Impossible to fetch Historical Exchange Graph</p>
														</span>
													</div>
													<Button
														style={{ backgroundColor: borderColor, borderColor: borderColor }}
														size='sm'
														className='mt-2 mb-4'
														onClick={this.handleClick}>
														{' '}
														Try Again{' '}
													</Button>
												</>
											)}
										</CardHeader>
										{!listCurrencyLoaded && (
											<CardBody>
												{/* Chart */}
												<div className='text-center justify-content-center mt-3'>
													<BarLoader css='display: flex; justify-content: center;' color={'#2E3030'} size={15} />
												</div>
												<div className='chart'></div>
											</CardBody>
										)}
									</Card>
								)}
							</Col>
						</Row>
					</Row>
				</Container>
			</div>
		)
	}
}
