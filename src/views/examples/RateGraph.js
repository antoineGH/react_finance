import React, { Component } from 'react'
import { authFetch } from '../../auth'
import Select from 'react-dropdown-select'
import UserHeader from 'components/Headers/UserHeader.js'
import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'
import getDateAfter from '../currency/utils/getDateAfter'
import fetchCurrency from '../currency/utils/fetchCurrency'
import fetchHistoryCurrency from '../currency/utils/fetchHistoryCurrency'
import sortDate from '../currency/utils/sortDate'
import genValues from '../currency/utils/genValues'
import { currenciesName } from '../currency/utils/currenciesName'
import { Col } from 'react-bootstrap'
import { Card, CardHeader, FormGroup, Row, Container } from 'reactstrap'

// INFO: RATE GRAPH
export default class RateGraph extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.state = {
			listCurrency: [],
			listCurrencyError: false,
			listCurrencyLoaded: false,
			selectedSourceCurrency: 'Default Currency',
			selectedDestCurrency: 'EUR',
			style: {},
		}
	}
	// --- COMPONENT LIFECYCLE ---

	componentDidMount() {
		this.fetchUserSettings().then((response) => {
			this.setState({ selectedSourceCurrency: response.default_currency })
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
					this.setState({ listCurrency: listCurrency, listCurrencyLoaded: true, listCurrencyError: false })
				})
				.catch((error) => {
					console.log(error)
					this.setState({ listCurrencyError: true })
				})
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
	// --- CLASS METHODS ---

	async fetchUserSettings() {
		const response = await authFetch('http://localhost:5000/api/user/setting', {
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

	handleActive(active) {
		this.props.setActive(active)
	}

	handleChangeSource(selected) {
		// INFO: IF ONE FIELD? IF TWO FIELD? IF BOTH
		selected && this.setState({ selectedSourceCurrency: selected[0].value })
	}

	handleChangeDestination(selected) {
		// INFO: IF ONE FIELD? IF TWO FIELD? IF BOTH
		selected && this.setState({ selectedDestCurrency: selected[0].value })
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
				this.setState({
					graphLegend: graphLegend,
					graphValues: graphValues,
					graphTitle: graphTitle,
					isHistoryLoaded: true,
					historyPercentage: historyPercentage,
				})
			})
			.catch((error) => {
				this.setState({ hasHistoryError: true })
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
		// INFO: base , dest from currency field !
		this.props.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		this.handleActive('1Y')
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
		this.props.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		this.handleActive('6M')
	}

	getThreeMonths() {
		const date = new Date(Date.now())
		const start_date = getDate(date)
		let end_date = getDateBefore(date, 3, 'months')
		end_date = getDateAfter(end_date, 2, 'days')
		this.props.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		this.handleActive('3M')
	}

	getMonth() {
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.props.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		this.handleActive('1M')
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
		this.props.getGraphInfo(end_date, start_date, this.state.selectedSourceCurrency, this.state.selectedDestCurrency)
		this.handleActive('1W')
	}

	render() {
		const { color, borderColor, pointBackgroundColor, pointHoverBackgroundColor } = this.props
		const { listCurrency, listCurrencyError, listCurrencyLoaded, selectedSourceCurrency, selectedDestCurrency, style } = this.state
		const welcome = 'Exchange Rate Graph'
		const message = 'Foreign Exchange Rates Graph based on current values from around the world..'

		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')

		return (
			<div>
				<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
				<Container className='mt--7' fluid>
					{/* User settings */}
					<div className='pl-lg-4'>
						<Row style={{ width: '100%' }}>
							<Col lg='3'>
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
												{selectedSourceCurrency && (
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
						</Row>
					</div>
				</Container>
			</div>
		)
	}
}
