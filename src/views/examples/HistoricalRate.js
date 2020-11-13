import React, { Component } from 'react'
import UserHeader from 'components/Headers/UserHeader.js'
import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'
import sortDate from '../currency/utils/sortDate'
import fetchCurrency from 'views/currency/utils/fetchCurrency'
import fetchHistoryCurrency from '../currency/utils/fetchHistoryCurrency'
import Pagination from 'react-js-pagination'
import { authFetch } from '../../auth'
import Select from 'react-dropdown-select'
import { currenciesName } from '../currency/utils/currenciesName'
import BarLoader from 'react-spinners/BarLoader'
import { Table } from 'reactstrap'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { Card, CardHeader, CardBody, FormGroup, Input, Container, Row } from 'reactstrap'

export default class HistoricalRate extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
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
		this.fetchUserSettings().then((response) => {
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
					console.log(error)
					this.setState({ listCurrencyError: true, listCurrencyHistoryError: true })
				})
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
	}

	render() {
		const { listCurrency, listCurrencyLoaded, listCurrencyError, selectedCurrency } = this.state
		const welcome = 'Historical Exchange Rate'
		const message = 'Foreign Exchange Rates Historical Search.'

		return (
			<div>
				<UserHeader welcome={welcome} message={message} />
				<br />
				{/* User settings */}
				<h6 className='heading-small text-muted mb-4 ml-4'>User settings</h6>
				<div className='pl-lg-4'>
					<Row>
						<Col lg='3'>
							<FormGroup>
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
						</Col>
					</Row>
				</div>
			</div>
		)
	}
}
