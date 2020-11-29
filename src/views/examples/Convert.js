import React, { Component } from 'react'
import { authFetch } from '../../auth'
import Select from 'react-dropdown-select'
import InformationCurrency from '../currency/InformationCurrency'
import HistoryPercentage from '../currency/HistoricalPercentage'
import UserHeader from 'components/Headers/UserHeader.js'
import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'
import fetchCurrency from '../currency/utils/fetchCurrency'
import toCurrency from '../currency/utils/toCurrency'
import fromCurrency from '../currency/utils/fromCurrency'
import fetchHistoryCurrency from '../currency/utils/fetchHistoryCurrency'
import sortDate from '../currency/utils/sortDate'
import toastMessage from '../currency/utils/toastMessage'
import { currenciesName } from '../currency/utils/currenciesName'
import { Card, CardHeader, FormGroup, Row, Input, InputGroup, InputGroupAddon, InputGroupText, Container, Col } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet'

// INFO: CONVERT
export default class Convert extends Component {
	// --- CLASS CONSTRUCTOR ---

	constructor(props) {
		super(props)
		this.reverse = this.reverse.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.state = {
			listCurrency: [],
			listCurrencyError: false,
			listCurrencyLoaded: false,
			selectedSourceCurrency: 'USD',
			selectedDestCurrency: 'EUR',
			inputValue: '1',
			outputValue: '',
		}
	}

	// --- COMPONENT LIFECYCLE ---

	componentDidMount() {
		this.mounted = true
		this.fetchUserSettings()
			.then((response) => {
				const selectedSourceCurrency = response.default_currency
				if (this.mounted) {
					this.setState({ selectedSourceCurrency: selectedSourceCurrency })
				}
				fetchCurrency(selectedSourceCurrency)
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
								outputValue: toCurrency(this.state.inputValue, this.state.selectedDestCurrency, listCurrency),
							})
							const date = new Date(Date.now())
							const start_date = getDateBefore(date, 1, 'months')
							const end_date = getDate(date)

							fetchHistoryCurrency(start_date, end_date, selectedSourceCurrency, this.state.selectedDestCurrency)
								.then((response) => {
									const orderedDates = sortDate(response)
									const historyPercentage = this.getHistoryPercentage(orderedDates, this.state.selectedDestCurrency)
									if (this.mounted) {
										this.setState({ historyPercentage: historyPercentage })
									}
								})
								.catch((error) => {
									toastMessage('Impossible to fetch currency history', 'error', 3500)
								})
						}
					})
					.catch((error) => {
						toastMessage('Impossible to fetch currency', 'error', 3500)
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				if (this.mounted) {
					this.setState({ listCurrencyError: true })
				}
			})
	}

	componentWillUnmount() {
		this.mounted = false
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

	setBase(selectedCurrency) {
		if (this.mounted) {
			this.setState({ listCurrencyLoaded: false })
		}
		fetchCurrency(selectedCurrency)
			.then((response) => {
				if (this.mounted) {
					this.setState({ date: response.date })
				}
				const currencies = []
				for (const [prop, value] of Object.entries(response.rates)) {
					const currencyName = '(' + currenciesName[prop] + ')'
					currencies.push({
						value: prop,
						label: `${prop} ${currencyName}`,
						rate: value,
					})
				}

				if (this.mounted) {
					this.setState({
						listCurrency: currencies,
						listCurrencyLoaded: true,
						listCurrencyError: false,
						outputValue: toCurrency(this.state.inputValue, this.state.selectedDestCurrency, currencies),
					})
				}
			})
			.catch((error) => {
				if (this.mounted) {
					this.setState({ listCurrencyError: true, listCurrencyLoaded: false })
				}
			})
	}

	handleChangeSource(selected) {
		selected && this.setState({ selectedSourceCurrency: selected[0].value })
		this.setBase(selected[0].value)
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')

		fetchHistoryCurrency(end_date, start_date, selected[0].value, this.state.selectedDestCurrency)
			.then((response) => {
				const orderedDates = sortDate(response)
				const historyPercentage = this.getHistoryPercentage(orderedDates, this.state.selectedDestCurrency)
				if (this.mounted) {
					this.setState({
						historyPercentage: historyPercentage,
					})
				}
			})
			.catch((error) => {
				if (this.mounted) {
					toastMessage('Impossible to fetch currency history', 'error', 3500)
				}
			})
	}

	handleChangeDestination(selected) {
		if (this.mounted) {
			selected && this.setState({ selectedDestCurrency: selected[0].value })
		}
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		fetchHistoryCurrency(end_date, start_date, this.state.selectedSourceCurrency, selected[0].value)
			.then((response) => {
				const orderedDates = sortDate(response)
				const historyPercentage = this.getHistoryPercentage(orderedDates, this.state.selectedDestCurrency)
				if (this.mounted) {
					this.setState({
						historyPercentage: historyPercentage,
						outputValue: toCurrency(this.state.inputValue, selected[0].value, this.state.listCurrency),
					})
				}
			})
			.catch((error) => {
				toastMessage('Impossible to change destination currency', 'error', 3500)
			})
	}

	handleValueInputChange(value) {
		this.setState({
			inputValue: value,
			outputValue: toCurrency(value, this.state.selectedDestCurrency, this.state.listCurrency),
		})
	}

	handleValueOutputChange(value) {
		this.setState({
			outputValue: value,
			inputValue: fromCurrency(value, this.state.selectedDestCurrency, this.state.listCurrency),
		})
	}

	getHistoryPercentage(orderedDates, destCurrency) {
		const orderedDatesKeys = Object.keys(orderedDates)
		const firstKey = orderedDatesKeys[0]
		const lastKey = orderedDatesKeys[orderedDatesKeys.length - 1]
		const t0 = orderedDates[firstKey][destCurrency]
		const t1 = orderedDates[lastKey][destCurrency]
		let historyPercentage = ((t1 - t0) / t0) * 100
		historyPercentage = Math.round(historyPercentage * 10000) / 10000
		return historyPercentage
	}

	getListExchange(startDate, endDate, baseCurrency, listCurrency) {
		this.setState({ listCurrencyError: false, listCurrencyLoaded: false })
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

					if (this.mounted) {
						this.setState({
							listCurrencyHistory: [
								...this.state.listCurrencyHistory,
								{
									baseCurrency: baseCurrency,
									destCurrency: destCurrency,
									rate: rate,
									historyPercentage: historyPercentage,
								},
							],
						})
						if (this.state.listCurrencyHistory.length === items - 2) {
							this.setState({ listCurrencyLoaded: true })
						}
					}
				})
				.catch((error) => {
					if (this.mounted) {
						this.setState({ listCurrencyError: true })
					}
					toastMessage('Impossible to set initial state', 'error', 3500)
				})
		}
	}

	reverse() {
		const selectedSourceCurrency = this.state.selectedSourceCurrency
		const selectedDestCurrency = this.state.selectedDestCurrency
		this.setBase(selectedDestCurrency)
		this.setState({
			selectedDestCurrency: selectedSourceCurrency,
			selectedSourceCurrency: selectedDestCurrency,
		})

		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.setState({ listCurrencyHistory: [] })
		fetchHistoryCurrency(end_date, start_date, this.state.selectedDestCurrency, this.state.selectedSourceCurrency)
			.then((response) => {
				const orderedDates = sortDate(response)
				const historyPercentage = this.getHistoryPercentage(orderedDates, selectedSourceCurrency)
				if (this.mounted) {
					this.setState({
						historyPercentage: historyPercentage,
					})
				}
			})
			.catch((error) => {
				toastMessage('Impossible to fetch currency history', 'error', 3500)
			})
	}

	handleClick() {
		this.setState({ listCurrencyError: false, listCurrencyLoaded: false })
		this.fetchUserSettings()
			.then((response) => {
				const selectedSourceCurrency = response.default_currency
				if (this.mounted) {
					this.setState({ selectedSourceCurrency: selectedSourceCurrency })
				}
				fetchCurrency(selectedSourceCurrency)
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
								outputValue: toCurrency(this.state.inputValue, this.state.selectedDestCurrency, listCurrency),
							})
						}
						const date = new Date(Date.now())
						const start_date = getDateBefore(date, 1, 'months')
						const end_date = getDate(date)

						fetchHistoryCurrency(start_date, end_date, selectedSourceCurrency, this.state.selectedDestCurrency)
							.then((response) => {
								toastMessage('Service Available', 'success', 3500)
								const orderedDates = sortDate(response)
								const historyPercentage = this.getHistoryPercentage(orderedDates, this.state.selectedDestCurrency)
								if (this.mounted) {
									this.setState({ historyPercentage: historyPercentage })
								}
							})
							.catch((error) => {
								toastMessage('Impossible to fetch currency history', 'error', 3500)
							})
					})
					.catch((error) => {
						toastMessage('Impossible to fetch currency', 'error', 3500)
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				if (this.mounted) {
					this.setState({ listCurrencyError: true, listCurrencyLoaded: true })
				}
			})
	}

	getCardColor(color) {
		let split = color.split(',')
		let myColor = split[2].substr(0, split[2].length - 1)
		split[1] = myColor
		return split.toString()
	}

	render() {
		const { color, borderColor } = this.props
		const cardColor = this.getCardColor(color)

		const { listCurrency, listCurrencyError, listCurrencyLoaded, selectedSourceCurrency, selectedDestCurrency, historyPercentage } = this.state
		const welcome = 'Convert Currency'
		const message = 'Our currency converter calculator will convert your money based on current values from around the world.'
		const date = new Date(Date.now())
		const start_date = getDateBefore(date, 1, 'months')
		const end_date = getDate(date)

		return (
			<>
				<Helmet>
					<title>Financial - Convert</title>
				</Helmet>
				<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
				{/* User settings */}
				<Container className='mt--7' fluid>
					<Row className='justify-content-center justify-content-lg-start'>
						<Col lg='12' xl='12'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='align-items-center'>
										<div className='col'>
											<h5 className='text-uppercase text-muted mb-0 card-title'>
												Convert Currency{' '}
												{selectedSourceCurrency &&
													selectedDestCurrency &&
													'(' + selectedSourceCurrency + ' - ' + selectedDestCurrency + ')'}
											</h5>
										</div>
										<Col className='text-right' xs='4'>
											{listCurrencyError && (
												<Button
													size='md'
													className='reverse'
													style={{
														backgroundColor: borderColor,
														borderColor: borderColor,
													}}
													onClick={this.handleClick}>
													Try Again
												</Button>
											)}
										</Col>
									</Row>
									<Row className='align-items-center'>
										<Col lg='3'>
											<FormGroup>
												<label className='form-control-label' style={{ fontSize: '0.70rem' }} htmlFor='input-username'>
													Input Value
												</label>
												<InputGroup>
													<InputGroupAddon addonType='prepend'>
														<InputGroupText style={{ backgroundColor: borderColor }} className='decoration-input'>
															{this.state.selectedSourceCurrency}
														</InputGroupText>
													</InputGroupAddon>
													<Input
														className='inputValue form-control-input'
														style={{ paddingLeft: '0.85rem' }}
														type='text'
														value={this.state.inputValue}
														onChange={(e) => this.handleValueInputChange(e.currentTarget.value)}
													/>
												</InputGroup>
											</FormGroup>
										</Col>
										<Col lg='7' xl='4'>
											<FormGroup>
												<label className='form-control-label' style={{ fontSize: '0.70rem' }} htmlFor='input-username'>
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
										</Col>
									</Row>
									<Row style={{ marginTop: '-1%', marginBottom: '-1%' }}>
										<Col lg='1' xl='1' className='offset-3 offset-sm-4 mb-3 mb-md-0 offset-lg-10 offset-xl-7'>
											<Button
												size='md'
												className='reverse ml-4'
												style={{
													backgroundColor: borderColor,
													borderColor: borderColor,
												}}
												onClick={this.reverse}>
												<i className='fas fa-random fa-md'></i>
											</Button>
										</Col>
									</Row>
									<Row className='align-items-center'>
										<Col lg='3'>
											<FormGroup>
												<label className='form-control-label' style={{ fontSize: '0.70rem' }} htmlFor='input-username'>
													Output Value
												</label>
												<InputGroup>
													<InputGroupAddon addonType='prepend'>
														<InputGroupText style={{ backgroundColor: borderColor }} className='decoration-input'>
															{this.state.selectedDestCurrency}
														</InputGroupText>
													</InputGroupAddon>
													<Input
														className='inputValue form-control-input'
														style={{ paddingLeft: '0.85rem' }}
														type='text'
														value={this.state.outputValue}
														onChange={(e) => this.handleValueOutputChange(e.currentTarget.value)}
													/>
												</InputGroup>
											</FormGroup>
										</Col>
										<Col lg='7' xl='4'>
											<FormGroup>
												<label className='form-control-label' style={{ fontSize: '0.70rem' }} htmlFor='input-username'>
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
										</Col>
									</Row>
								</CardHeader>
							</Card>
						</Col>
						<Col lg='6' xl='6' className='mt-4'>
							<InformationCurrency
								hasError={listCurrencyError}
								infoIsLoading={!listCurrencyLoaded}
								outputCurrency={selectedDestCurrency}
								inputCurrency={selectedSourceCurrency}
								listCurrency={listCurrency}
								date={'1999-05-05'}
								borderColor={borderColor}
								cardColor={cardColor}
							/>
						</Col>
						<Col lg='6' xl='6' className='mt-4'>
							<HistoryPercentage
								isHistoryLoaded={listCurrencyLoaded}
								hasHistoryError={listCurrencyError}
								outputCurrency={selectedDestCurrency}
								inputCurrency={selectedSourceCurrency}
								historyPercentage={historyPercentage}
								start_at={start_date}
								end_at={end_date}
								active={'1M'}
								borderColor={borderColor}
								cardColor={cardColor}
							/>
						</Col>
					</Row>
				</Container>
			</>
		)
	}
}
