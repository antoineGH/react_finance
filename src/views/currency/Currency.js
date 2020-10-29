import React, { Component } from 'react'
// import InformationCurrency from './InformationCurrency'
// import InformationDate from './InformationDate'
// import CurrencyGraph from '../graph/CurrencyGraph'

import Index from '../Index'

import ScaleLoader from 'react-spinners/ScaleLoader'

import fetchCurrency from './utils/fetchCurrency'
import toCurrency from './utils/toCurrency'
import fromCurrency from './utils/fromCurrency'
import { currenciesName } from './utils/currenciesName'
import sortDate from './utils/sortDate'
import genValues from './utils/genValues'
import getDate from './utils/getDate'
import getDateBefore from './utils/getDateBefore'
import fetchHistoryCurrency from './utils/fetchHistoryCurrency'
import getMonth from './utils/getMonth'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import fetchNewsFeed from './utils/fetchNewsFeed'
library.add(fas)

export default class Currency extends Component {
	// --- CLASS CONSTRUCTOR ---

	constructor(props) {
		super(props)
		this.handleCurrencyInputChange = this.handleCurrencyInputChange.bind(this)
		this.handleCurrencyOutputChange = this.handleCurrencyOutputChange.bind(this)
		this.handleValueInputChange = this.handleValueInputChange.bind(this)
		this.handleValueOutputChange = this.handleValueOutputChange.bind(this)
		this.getGraphInfo = this.getGraphInfo.bind(this)
		this.getNewsFeed = this.getNewsFeed.bind(this)
		this.setActive = this.setActive.bind(this)
		this.reverse = this.reverse.bind(this)
		this.setState = this.setState.bind(this)
		this.state = {
			isLoaded: false,
			hasError: false,
			isHistoryLoaded: false,
			hasHistoryError: false,
			infoIsLoading: false,
			listCurrency: '',
			listCurrencyHistory: [],
			inputCurrency: 'USD',
			outputCurrency: 'EUR',
			date: '',
			inputValue: '1',
			outputValue: '',
			historyPercentage: '',
			active: '1M',
			graphLegend: {},
			graphValues: {},
			graphTitle: {},
			optionsInput: { value: 'USD', label: 'USD' },
			optionsOutput: { value: 'EUR', label: 'EUR' },
			graphHistoryLegend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
			graphHistoryValue: [],
			hasGraphHistoryError: false,
			isGraphHistoryLoaded: false,
			newsFeedError: false,
			newsFeedLoaded: false,
			newsFeed: [],
		}
	}

	// --- COMPONENT LIFECYCLE ---

	componentDidMount() {
		fetchCurrency('USD')
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
				const date = new Date(Date.now())
				const start_date = getDate(date)
				const end_date = getDateBefore(date, 1, 'months')

				this.getListExchange(start_date, end_date, 'USD', currencies)
				this.setState({
					listCurrency: currencies,
					isLoaded: true,
					hasError: false,
				})
				if (this.state.inputValue && this.state.outputCurrency) {
					this.setState({
						outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies),
					})
				}
			})
			.catch((error) => {
				console.log(error)
				this.setState({ hasError: true })
			})

		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.getGraphInfo(end_date, start_date, 'USD', 'EUR')
		this.getHistoryGraphInfo(end_date, 'USD', 'EUR')
		this.getNewsFeed()
	}

	// --- CLASS METHODS ---

	// Get List Exchange
	getListExchange(startDate, endDate, baseCurrency, listCurrency) {
		for (let i = 0; i < 5; i++) {
			const randInt = Math.floor(Math.random() * listCurrency.length)
			const destCurrency = listCurrency[randInt]['value']
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
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	// Set base
	setBase(selectedCurrency) {
		this.setState({ infoIsLoading: true })
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
						isLoaded: true,
						hasError: false,
						infoIsLoading: false,
					})
					if (this.state.inputValue && this.state.outputCurrency) {
						this.setState({
							outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies),
						})
					}
				})
				.catch((error) => {
					console.log(error)
					this.setState({ hasError: true, infoIsLoading: false })
				})
		}, 2000)
	}

	// Get News Feed
	getNewsFeed() {
		this.setState({ newsFeedError: false, newsFeedLoaded: false })
		fetchNewsFeed(['Apple', 'Tesla', 'Microsoft'])
			.then((response) => {
				console.log(response.stories)
				console.log(typeof response.stories)
				this.setState({ newsFeedError: true, newsFeedLoaded: true, newsFeed: response.stories })
			})
			.catch((error) => {
				this.setState({ newsFeedError: true })
			})
	}

	// Get Graph Info
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
				console.log(error)
				this.setState({ hasHistoryError: true })
			})
	}

	// Get Historical Graph Info
	getHistoryGraphInfo(endDate, baseCurrency, destCurrency) {
		const graphHistoryDates = []
		const graphHistoryValue = []

		// Array with date interval of 1 month from endDate to graphHistoryLegend.length (12 months)
		for (let i = 0; i <= this.state.graphHistoryLegend.length; i++) {
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
		this.setState({ graphHistoryDateLegend: graphHistoryDateLegend })

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
					console.log(error)
					this.setState({ hasGraphHistoryError: true })
				})
			graphHistoryDates.pop()
		}
		this.setState({ graphHistoryValue: graphHistoryValue, isGraphHistoryLoaded: true })
	}

	// Currency input change
	handleCurrencyInputChange(selectedCurrency) {
		if (selectedCurrency === undefined) {
			this.setState({
				inputCurrency: '',
				outputValue: '',
				optionsInput: { value: '', label: '' },
			})
			return
		}
		this.setState({
			inputCurrency: selectedCurrency,
			optionsInput: { value: selectedCurrency, label: selectedCurrency },
		})
		this.setBase(selectedCurrency)
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')

		if (this.state.outputCurrency === '') {
			this.getGraphInfo(end_date, start_date, selectedCurrency, 'EUR')
			this.getHistoryGraphInfo(end_date, selectedCurrency, 'EUR')
		} else {
			this.getGraphInfo(end_date, start_date, selectedCurrency, this.state.outputCurrency)
			this.getHistoryGraphInfo(end_date, selectedCurrency, this.state.outputCurrency)
		}
		this.setState({ listCurrencyHistory: [] })
		this.getListExchange(start_date, end_date, selectedCurrency, this.state.listCurrency)
		setTimeout(() => {
			this.setState({ active: '1M' })
		}, 500)
	}

	// Currency output change
	handleCurrencyOutputChange(selectedCurrency) {
		if (selectedCurrency === undefined) {
			this.setState({
				outputCurrency: '',
				outputValue: '',
				optionsOutput: { value: '', label: '' },
			})
		} else {
			this.setState({
				outputCurrency: selectedCurrency,
				optionsOutput: {
					value: selectedCurrency,
					label: selectedCurrency,
				},
			})

			const date = new Date(Date.now())
			const start_date = getDate(date)
			const end_date = getDateBefore(date, 1, 'months')
			this.getGraphInfo(end_date, start_date, this.state.inputCurrency, selectedCurrency)
			this.getHistoryGraphInfo(end_date, this.state.inputCurrency, selectedCurrency)
			setTimeout(() => {
				this.setState({ active: '1M' })
			}, 500)

			if (this.state.inputValue && this.state.inputCurrency) {
				this.setState({
					outputValue: toCurrency(this.state.inputValue, selectedCurrency, this.state.listCurrency),
				})
			}
		}
	}

	// Value input change
	handleValueInputChange(value) {
		this.setState({ inputValue: value })
		if (this.state.inputCurrency && this.state.outputCurrency) {
			this.setState({
				outputValue: toCurrency(value, this.state.outputCurrency, this.state.listCurrency),
			})
		}
	}

	// Value output change
	handleValueOutputChange(value) {
		this.setState({ outputValue: value })
		if (this.state.inputCurrency && this.state.outputCurrency) {
			this.setState({
				inputValue: fromCurrency(value, this.state.outputCurrency, this.state.listCurrency),
			})
		}
	}

	// Handle Active
	setActive(active) {
		this.setState({ active: active })
	}

	// Reverse
	reverse() {
		const { inputCurrency, outputCurrency, optionsInput, optionsOutput } = this.state
		if (!inputCurrency || !outputCurrency) {
			return
		}
		this.setState({
			inputCurrency: outputCurrency,
			outputCurrency: inputCurrency,
			optionsInput: optionsOutput,
			optionsOutput: optionsInput,
		})
		this.setBase(outputCurrency)

		// Updating History
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.getGraphInfo(end_date, start_date, outputCurrency, inputCurrency)
		this.getHistoryGraphInfo(end_date, outputCurrency, inputCurrency)
		this.setState({ listCurrencyHistory: [] })
		this.getListExchange(start_date, end_date, outputCurrency, this.state.listCurrency)
		setTimeout(() => {
			this.setState({ active: '1M' })
		}, 500)
	}

	// Calculate Historical %
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

	render() {
		if (this.state.hasError) {
			return (
				<Container>
					<div className='error_data'>
						<FontAwesomeIcon className='mt-1 mr-1' size='lg' icon={['fas', 'times']} />
						Impossible to fetch data, try again later.
					</div>
				</Container>
			)
		}

		if (!this.state.isLoaded) {
			return (
				<>
					<Row>
						<Col xs={12} sm={12} md={12} lg={8}>
							<div className='mt-5'>
								<ScaleLoader css='display: flex; justify-content: center; margin-left:auto; margin-right:auto;' color={'#2E3030'} size={15} />
							</div>
						</Col>
					</Row>
				</>
			)
		} else {
			return (
				<>
					<Index
						state={this.state}
						onValueChangeInput={this.handleValueInputChange}
						onValueChangeOutput={this.handleValueOutputChange}
						onCurrencyChangeInput={this.handleCurrencyInputChange}
						onCurrencyChangeOutput={this.handleCurrencyOutputChange}
						reverse={this.reverse}
						getGraphInfo={this.getGraphInfo}
						getNewsFeed={this.getNewsFeed}
						active={this.state.active}
						setActive={this.setActive}
					/>
				</>
			)
		}
	}
}
