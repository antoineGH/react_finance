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
import { currenciesName } from '../currency/utils/currenciesName'
import { Col } from 'react-bootstrap'
import { Card, CardHeader, FormGroup, Row, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'
import Button from 'react-bootstrap/Button'

// INFO: CONVERT
export default class Convert extends Component {
	// --- CLASS CONSTRUCTOR ---

	constructor(props) {
		super(props)
		this.reverse = this.reverse.bind(this)
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
		this.fetchUserSettings()
			.then((response) => {
				const selectedSourceCurrency = response.default_currency
				this.setState({ selectedSourceCurrency: selectedSourceCurrency })
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
								this.setState({ historyPercentage: historyPercentage })
							})
							.catch((error) => {
								console.log(error)
							})
					})
					.catch((error) => {
						console.log(error)
					})
			})
			.catch((error) => {
				console.log(error)
				this.setState({ listCurrencyError: true })
			})
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

	setBase(selectedCurrency) {
		this.setState({ listCurrencyLoaded: false })
		setTimeout(() => {
			fetchCurrency(selectedCurrency)
				.then((response) => {
					this.setState({ date: response.date })
					const currencies = []
					for (const [prop, value] of Object.entries(response.rates)) {
						const currencyName = '(' + currenciesName[prop] + ')'
						currencies.push({
							value: prop,
							label: `${prop} ${currencyName}`,
							rate: value,
						})
					}
					this.setState({
						listCurrency: currencies,
						listCurrencyLoaded: true,
						listCurrencyError: false,
						outputValue: toCurrency(this.state.inputValue, this.state.selectedDestCurrency, currencies),
					})
				})
				.catch((error) => {
					this.setState({ listCurrencyError: true, listCurrencyLoaded: false })
				})
		}, 2000)
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
				this.setState({
					historyPercentage: historyPercentage,
					// outputValue: toCurrency(this.state.inputValue, this.state.selectedDestCurrency, this.state.listCurrency),
				})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	handleChangeDestination(selected) {
		selected && this.setState({ selectedDestCurrency: selected[0].value })
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		fetchHistoryCurrency(end_date, start_date, this.state.selectedSourceCurrency, selected[0].value)
			.then((response) => {
				const orderedDates = sortDate(response)
				const historyPercentage = this.getHistoryPercentage(orderedDates, this.state.selectedDestCurrency)
				this.setState({
					historyPercentage: historyPercentage,
					outputValue: toCurrency(this.state.inputValue, selected[0].value, this.state.listCurrency),
				})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	handleValueInputChange(value) {
		this.setState({
			inputValue: value,
			outputValue: toCurrency(value, this.state.selectedDestCurrency, this.state.listCurrency),
		})
	}

	handleValueOutputChange(value) {
		this.setState({ outputValue: value, inputValue: fromCurrency(value, this.state.selectedDestCurrency, this.state.listCurrency) })
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
				})
				.catch((error) => {
					this.setState({ listCurrencyError: true })
					console.log(error)
				})
		}
	}

	reverse() {
		const selectedSourceCurrency = this.state.selectedSourceCurrency
		const selectedDestCurrency = this.state.selectedDestCurrency
		this.setBase(selectedDestCurrency)
		this.setState({ selectedDestCurrency: selectedSourceCurrency, selectedSourceCurrency: selectedDestCurrency })

		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.setState({ listCurrencyHistory: [] })
		fetchHistoryCurrency(end_date, start_date, this.state.selectedDestCurrency, this.state.selectedSourceCurrency)
			.then((response) => {
				const orderedDates = sortDate(response)
				const historyPercentage = this.getHistoryPercentage(orderedDates, selectedSourceCurrency)
				this.setState({
					historyPercentage: historyPercentage,
				})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	render() {
		const { color, borderColor } = this.props
		const { listCurrency, listCurrencyError, listCurrencyLoaded, selectedSourceCurrency, selectedDestCurrency, historyPercentage } = this.state
		const welcome = 'Convert Currency'
		const message = 'Our currency converter calculator will convert your money based on current values from around the world.'
		const date = new Date(Date.now())
		const start_date = getDateBefore(date, 1, 'months')
		const end_date = getDate(date)

		return (
			<>
				<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
				{/* User settings */}
				<Row className='pl-lg-4 mt--7'>
					<Col xs='12' lg='5'>
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
										<Button
											size='sm'
											className='reverse'
											style={{ backgroundColor: borderColor, borderColor: borderColor }}
											onClick={this.reverse}>
											<i className='fas fa-random'></i>
										</Button>
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
									<Col lg='8'>
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
									<Col lg='8'>
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
					<Col lg='4' xl='2' className='mt-4 mt-xl-0'>
						<InformationCurrency
							hasError={listCurrencyError}
							infoIsLoading={!listCurrencyLoaded}
							outputCurrency={selectedDestCurrency}
							inputCurrency={selectedSourceCurrency}
							listCurrency={listCurrency}
							date={'1999-05-05'}
							borderColor={borderColor}
						/>
					</Col>
					<Col lg='4' xl='2' className='mt-4 mt-xl-0'>
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
						/>
					</Col>
				</Row>
			</>
		)
	}
}
