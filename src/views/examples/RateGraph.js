import React, { Component } from 'react'
import { authFetch } from '../../auth'
import Select from 'react-dropdown-select'
import BarLoader from 'react-spinners/BarLoader'
import UserHeader from 'components/Headers/UserHeader.js'
import LineGraph from '../graph/LineGraph'
import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'
import getDateAfter from '../currency/utils/getDateAfter'
import fetchCurrency from '../currency/utils/fetchCurrency'
import fetchHistoryCurrency from '../currency/utils/fetchHistoryCurrency'
import sortDate from '../currency/utils/sortDate'
import genValues from '../currency/utils/genValues'
import activeToDate from '../currency/utils/activeToDate'
import { currenciesName } from '../currency/utils/currenciesName'
import toastMessage from '../currency/utils/toastMessage'
import { Col } from 'react-bootstrap'
import { Card, CardHeader, FormGroup, Row, Container, NavItem, NavLink, Nav, CardBody, Button } from 'reactstrap'
import { Helmet } from 'react-helmet'

// INFO: RATE GRAPH
export default class RateGraph extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.getYear = this.getYear.bind(this)
		this.getSixMonths = this.getSixMonths.bind(this)
		this.getThreeMonths = this.getThreeMonths.bind(this)
		this.getMonth = this.getMonth.bind(this)
		this.getWeek = this.getWeek.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.state = {
			listCurrency: [],
			listCurrencyError: false,
			listCurrencyLoaded: false,
			selectedSourceCurrency: 'Default Currency',
			selectedDestCurrency: 'EUR',
			graphLoaded: false,
			graphError: false,
			graphValues: {},
			graphLegend: {},
			graphTitle: {},
			style: {},
			active: '1M',
		}
	}
	// --- COMPONENT LIFECYCLE ---

	componentDidMount() {
		this.mounted = true
		this.fetchUserSettings()
			.then((response) => {
				if (this.mounted) {
					this.setState({ selectedSourceCurrency: response.default_currency })
				}
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
						if (this.mounted) {
							this.setState({
								listCurrency: listCurrency,
								listCurrencyLoaded: true,
								listCurrencyError: false,
							})
						}
						const date = new Date(Date.now())
						const start_date = getDate(date)
						const end_date = getDateBefore(date, 1, 'months')
						this.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
					})
					.catch((error) => {
						toastMessage('Impossible to load Exchange Rate Graph', 'error', 3500)
						if (this.mounted) {
							this.setState({ listCurrencyError: true })
						}
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				if (this.mounted) {
					this.setState({ listCurrencyError: true, graphError: true, listCurrencyLoaded: true })
				}
			})
		this.createMockData()
	}

	componentWillUnmount() {
		this.mounted = false
	}

	static getDerivedStateFromProps(props) {
		return {
			backgroundColor: props.backgroundColor,
			borderColor: props.borderColor,
			pointBackgroundColor: props.pointBackgroundColor,
			pointHoverBackgroundColor: props.pointHoverBackgroundColor,
		}
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
		if (this.mounted) {
			selected && this.setState({ selectedSourceCurrency: selected[0].value, active: '1M' })
		}
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'month')
		this.getGraphInfo(end_date, start_date, selected[0].value, this.state.selectedDestCurrency)
	}

	handleChangeDestination(selected) {
		if (this.mounted) {
			selected && this.setState({ selectedDestCurrency: selected[0].value, active: '1M' })
		}
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'month')
		this.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, selected[0].value)
	}

	getGraphInfo(startDate, endDate, baseCurrency, destCurrency) {
		fetchHistoryCurrency(startDate, endDate, baseCurrency, destCurrency)
			.then((response) => {
				const graphTitle = {
					base: baseCurrency,
					dest: destCurrency,
					start_at: startDate,
					end_at: endDate,
				}
				const orderedDates = sortDate(response)
				const historyPercentage = this.getHistoryPercentage(orderedDates, destCurrency)
				const { graphLegend, graphValues } = genValues(orderedDates, destCurrency)
				if (this.mounted) {
					this.setState({
						graphLegend: graphLegend,
						graphValues: graphValues,
						graphTitle: graphTitle,
						isHistoryLoaded: true,
						historyPercentage: historyPercentage,
						graphLoaded: true,
						graphError: false,
					})
				}
			})
			.catch((error) => {
				if (this.mounted) {
					this.setState({ hasHistoryError: true, graphError: true })
				}
			})
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

	getYear() {
		const currency_style = {
			borderColor: 'rgb(255, 93, 93)',
			backgroundColor: 'rgba(255, 10, 13, 0.1)',
			pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 93, 93)',
			pointHoverRadius: 8,
			pointHoverBackgroundColor: 'rgb(255, 93, 93)',
			maxTicksLimit: 12,
		}
		this.setState({ style: currency_style })
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'years')
		this.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		if (this.mounted) {
			this.setState({ active: '1Y' })
		}
	}

	getSixMonths() {
		const currency_style = {
			borderColor: 'rgb(255, 93, 93)',
			backgroundColor: 'rgba(255, 10, 13, 0.1)',
			pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 93, 93)',
			pointHoverRadius: 8,
			pointHoverBackgroundColor: 'rgb(255, 93, 93)',
			maxTicksLimit: 6,
		}
		this.setState({ style: currency_style })
		const date = new Date(Date.now())
		const start_date = getDate(date)
		let end_date = getDateBefore(date, 6, 'months')
		end_date = getDateAfter(end_date, 2, 'days')
		this.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		if (this.mounted) {
			this.setState({ active: '6M' })
		}
	}

	getThreeMonths() {
		const date = new Date(Date.now())
		const start_date = getDate(date)
		let end_date = getDateBefore(date, 3, 'months')
		end_date = getDateAfter(end_date, 2, 'days')
		this.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		if (this.mounted) {
			this.setState({ active: '3M' })
		}
	}

	getMonth() {
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		if (this.mounted) {
			this.setState({ active: '1M' })
		}
	}

	getWeek() {
		const currency_style = {
			borderColor: 'rgb(255, 93, 93)',
			backgroundColor: 'rgba(255, 10, 13, 0.1)',
			pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 93, 93)',
			pointHoverRadius: 8,
			pointHoverBackgroundColor: 'rgb(255, 93, 93)',
			maxTicksLimit: 7,
		}
		this.setState({ style: currency_style })
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 9, 'days')
		this.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		if (this.mounted) {
			this.setState({ active: '1W' })
		}
	}

	handleClick() {
		this.setState({ graphError: false, listCurrencyLoaded: false })
		this.fetchUserSettings()
			.then((response) => {
				if (this.mounted) {
					this.setState({ selectedSourceCurrency: response.default_currency })
				}
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
						if (this.mounted) {
							this.setState({
								listCurrency: listCurrency,
								listCurrencyLoaded: true,
								listCurrencyError: false,
							})
						}
						const date = new Date(Date.now())
						const start_date = getDate(date)
						const end_date = getDateBefore(date, 1, 'months')
						this.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
					})
					.catch((error) => {
						toastMessage('Impossible to load Exchange Rate Graph', 'error', 3500)
						if (this.mounted) {
							this.setState({ listCurrencyError: true })
						}
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				if (this.mounted) {
					this.setState({ listCurrencyError: true, graphError: true, listCurrencyLoaded: true })
				}
			})
		this.createMockData()
	}

	render() {
		const { color, backgroundColor, borderColor, pointBackgroundColor, pointHoverBackgroundColor } = this.props
		const {
			graphLoaded,
			graphError,
			graphValues,
			graphLegend,
			graphTitle,
			listCurrency,
			listCurrencyError,
			listCurrencyLoaded,
			selectedSourceCurrency,
			selectedDestCurrency,
			style,
			active,
		} = this.state
		const welcome = 'Exchange Rate Graph'
		const message = 'Foreign Exchange Rates Graph based on current values from around the world..'

		return (
			<div>
				<Helmet>
					<title>Financial - Exchange Rate Graph</title>
				</Helmet>
				<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
				<Container className='mt--7' fluid>
					{/* User settings */}
					<Row>
						<Col lg='12' xl='3'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='align-items-center'>
										<div className='col'>
											<h5 className='text-uppercase text-muted mb-0 card-title'>
												Exchange Rate Graph{' '}
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
						<Col className='mb-5 mb-xl-0 mt-4 mt-xl-0' lg='12' xl='9'>
							{selectedSourceCurrency && selectedDestCurrency && graphLoaded && !graphError ? (
								<Card className='bg-gradient-default shadow'>
									<CardHeader className='bg-transparent'>
										<Row className='align-items-center'>
											<div className='col-12 col-lg-6'>
												<h5 className='text-uppercase text-muted mb-0 card-title'>
													Exchange Rate ({graphTitle.base} - {graphTitle.dest})
												</h5>
												<p className='mt-1 mb-0 text-muted text-sm'>
													<span className='text-nowrap'>
														{activeToDate(active)}: {graphTitle.start_at} <i className='fa-xs fas fa-chevron-right'></i>{' '}
														{graphTitle.end_at}
													</span>
												</p>
											</div>
											<div className='col-12 col-lg-6 mt-4 mt-xl-0'>
												<Nav className='justify-content-end' pills>
													<NavItem>
														<NavLink
															style={
																active === '1W'
																	? {
																			backgroundColor: borderColor,
																			color: 'white',
																	  }
																	: {}
															}
															onClick={this.getWeek}
															href='#'>
															<span className='d-none d-md-block'>1W</span>
															<span className='d-md-none'>1W</span>
														</NavLink>
													</NavItem>
													<NavItem>
														<NavLink
															style={
																active === '1M'
																	? {
																			backgroundColor: borderColor,
																			color: 'white',
																	  }
																	: {}
															}
															onClick={this.getMonth}
															href='#'>
															<span className='d-none d-md-block'>1M</span>
															<span className='d-md-none'>1M</span>
														</NavLink>
													</NavItem>
													<NavItem>
														<NavLink
															style={
																active === '3M'
																	? {
																			backgroundColor: borderColor,
																			color: 'white',
																	  }
																	: {}
															}
															onClick={this.getThreeMonths}
															href='#'>
															<span className='d-none d-md-block'>3M</span>
															<span className='d-md-none'>3M</span>
														</NavLink>
													</NavItem>
													<NavItem>
														<NavLink
															style={
																active === '6M'
																	? {
																			backgroundColor: borderColor,
																			color: 'white',
																	  }
																	: {}
															}
															onClick={this.getSixMonths}
															href='#'>
															<span className='d-none d-md-block'>6M</span>
															<span className='d-md-none'>6M</span>
														</NavLink>
													</NavItem>
													<NavItem>
														<NavLink
															style={
																active === '1Y'
																	? {
																			backgroundColor: borderColor,
																			color: 'white',
																	  }
																	: {}
															}
															onClick={this.getYear}
															href='#'>
															<span className='d-none d-md-block'>1Y</span>
															<span className='d-md-none'>1Y</span>
														</NavLink>
													</NavItem>
												</Nav>
											</div>
										</Row>
									</CardHeader>
									<CardBody>
										<div className='chart'>
											<LineGraph
												graphValues={graphValues}
												graphLegend={graphLegend}
												graphTitle={graphTitle}
												style={style}
												backgroundColor={backgroundColor}
												borderColor={borderColor}
												pointBackgroundColor={pointBackgroundColor}
												pointHoverBackgroundColor={pointHoverBackgroundColor}
											/>
										</div>
									</CardBody>
								</Card>
							) : (
								<Card className='bg-gradient-default shadow'>
									<CardHeader className='bg-transparent'>
										<Row className='align-items-center'>
											<div className='col'>
												<h5 className='text-uppercase text-muted mb-0 card-title'>Exchange Rate</h5>
												<span style={{ fontSize: '0.80rem' }}></span>
											</div>
										</Row>
										{graphError && (
											<>
												<div className='text-left justify-content-left'>
													<span style={{ fontSize: '0.80rem' }}>
														&nbsp;
														<br />
														<p className='mt-1 mb-2'>Impossible to fetch Exchange Rate Graph</p>
													</span>
												</div>
												<Button
													style={{ backgroundColor: borderColor, borderColor: borderColor, color: 'white' }}
													size='sm'
													className='mt-2 mb-4 mt-2'
													onClick={this.handleClick}>
													{' '}
													Try Again{' '}
												</Button>
											</>
										)}
									</CardHeader>
									{!listCurrencyLoaded && (
										<CardBody>
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
				</Container>
			</div>
		)
	}
}
