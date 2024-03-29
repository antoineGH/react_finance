import React, { Component } from 'react'

import Index from '../Index'
import BarLoader from 'react-spinners/BarLoader'
import UserHeader from '../../components/Headers/UserHeader'

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
import { news } from './utils/newsFeedJson'
import toastMessage from './utils/toastMessage'
import { Helmet } from 'react-helmet'
// eslint-disable-next-line
import fetchNewsFeed from './utils/fetchNewsFeed'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import { Card, CardBody, CardHeader } from 'reactstrap'

import { authFetch } from '../../auth'

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
		this.handleClick = this.handleClick.bind(this)
		this.reverse = this.reverse.bind(this)
		this.setState = this.setState.bind(this)
		this.state = {
			infoIsLoading: false,

			isLoaded: false,
			hasError: false,

			inputCurrency: 'USD',
			outputCurrency: 'EUR',

			date: '',
			active: '1M',
			inputValue: '1',
			outputValue: '',
			historyPercentage: '',

			listCurrency: '',
			optionsInput: { value: 'USD', label: 'USD (United States Dollar)' },
			optionsOutput: { value: 'EUR', label: 'EUR (Euro)' },

			isHistoryLoaded: false,
			hasHistoryError: false,

			graphTitle: {},
			isGraphHistoryLoaded: false,
			hasGraphHistoryError: false,

			graphHistoryLegend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
			graphHistoryValue: [],

			graphLegend: {},
			graphValues: {},

			newsFeedLoaded: false,
			newsFeedError: false,
			newsFeed: [],

			listCurrencyLoaded: false,
			listCurrencyError: false,
			listCurrencyHistory: [],
		}
	}

	// --- COMPONENT LIFECYCLE ---
	componentDidMount() {
		this.mounted = true
		this.fetchUserSettings()
			.then((response) => {
				const defaultCurrency = response.default_currency
				if (this.mounted) {
					this.setState({
						inputCurrency: defaultCurrency,
						optionsInput: {
							value: defaultCurrency,
							label: defaultCurrency + ' (' + currenciesName[defaultCurrency] + ')',
						},
					})
				}
				fetchCurrency(defaultCurrency)
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
						const date = new Date(Date.now())
						const start_date = getDate(date)
						const end_date = getDateBefore(date, 1, 'months')

						this.getListExchange(start_date, end_date, this.state.inputCurrency, currencies)
						if (this.mounted) {
							this.setState({
								listCurrency: currencies,
								isLoaded: true,
								hasError: false,
							})
						}
						if (this.state.inputValue && this.state.outputCurrency) {
							if (this.mounted) {
								this.setState({
									outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies),
								})
							}
						}
						this.getGraphInfo(end_date, start_date, this.state.inputCurrency, 'EUR')
						this.getHistoryGraphInfo(end_date, this.state.inputCurrency, 'EUR')
						this.getNewsFeed()
					})
					.catch((error) => {
						if (this.mounted) {
							this.setState({ hasError: true })
						}
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				if (this.mounted) {
					this.setState({ hasError: true, isLoaded: true })
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

	// Get List Exchange
	getListExchange(startDate, endDate, baseCurrency, listCurrency) {
		if (this.mounted) {
			this.setState({ listCurrencyError: false, listCurrencyLoaded: false })
		}
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
					}
					if (this.state.listCurrencyHistory.length === items - 2) {
						if (this.mounted) {
							this.setState({ listCurrencyLoaded: true })
						}
					}
				})
				.catch((error) => {
					if (this.mounted) {
						this.setState({ listCurrencyError: true })
					}
				})
		}
	}

	// Set base
	setBase(selectedCurrency) {
		if (this.mounted) {
			this.setState({ infoIsLoading: true })
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
						isLoaded: true,
						hasError: false,
						infoIsLoading: false,
					})
				}
				if (this.state.inputValue && this.state.outputCurrency) {
					if (this.mounted) {
						this.setState({
							outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies),
						})
					}
				}
			})
			.catch((error) => {
				if (this.mounted) {
					this.setState({ hasError: true, infoIsLoading: false })
				}
			})
	}

	// Get News Feed
	getNewsFeed(interests) {
		// INFO: GET NEWS FEED HARDCODED
		if (this.mounted) {
			this.setState({ newsFeed: news, newsFeedLoaded: true, newsFeedError: false })
		}
		// INFO: GET NEWS FEED API
		// this.setState({ newsFeedError: false, newsFeedLoaded: false })
		// if (!interests) {
		// 	interests = ['Apple', 'Tesla', 'Microsoft']
		// 	fetchNewsFeed('cityfalcon', interests)
		// 		.then((response) => {
		// 			const stories = response.stories
		// 			this.setState({ newsFeedError: false, newsFeedLoaded: true, newsFeed: stories })
		// 		})
		// 		.catch((error) => {
		// 			this.setState({ newsFeedError: true })
		// 		})
		// 	return
		// }
		// Promise.all([fetchNewsFeed('cityfalcon', interests), fetchNewsFeed('tickers', interests)])
		// 	.then((response) => {
		// 		const storiesInterest = response[0].stories
		// 		const storiesTickers = response[1].stories
		// 		const stories = storiesInterest.concat(storiesTickers)
		// 		console.log(stories)
		// 		let flags = [],
		// 			storiesUnique = []
		// 		for (let i = 0; i < stories.length; i++) {
		// 			if (flags[stories[i].uuid]) continue
		// 			flags[stories[i].uuid] = true
		// 			const obj = {
		// 				uuid: stories[i].uuid,
		// 				publishTime: stories[i].publishTime,
		// 				cityfalconScore: stories[i].cityfalconScore,
		// 				title: stories[i].title,
		// 				description: stories[i].description,
		// 				source: stories[i].source,
		// 			}
		// 			storiesUnique.push(obj)
		// 		}
		// 		console.log(storiesUnique)
		// 		this.setState({ newsFeedError: false, newsFeedLoaded: true, newsFeed: storiesUnique })
		// 	})
		// 	.catch((error) => {
		// 		this.setState({ newsFeedError: true })
		// 	})
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
				if (this.mounted) {
					this.setState({
						graphLegend: graphLegend,
						graphValues: graphValues,
						graphTitle: graphTitle,
						isHistoryLoaded: true,
						historyPercentage: historyPercentage,
					})
				}
			})
			.catch((error) => {
				if (this.mounted) {
					this.setState({ hasHistoryError: true })
				}
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
		if (this.mounted) {
			this.setState({ graphHistoryDateLegend: graphHistoryDateLegend })
		}

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
					if (this.mounted) {
						this.setState({ hasGraphHistoryError: true })
					}
				})
			graphHistoryDates.pop()
		}
		if (this.mounted) {
			this.setState({ graphHistoryValue: graphHistoryValue, isGraphHistoryLoaded: true })
		}
	}

	// Currency input change
	handleCurrencyInputChange(selectedCurrency, label) {
		if (selectedCurrency === undefined) {
			this.setState({
				inputCurrency: '',
				outputValue: '',
				optionsInput: { value: '', label: '' },
			})
			toastMessage('Please select input currency', 'warning', 3500)
			return
		}
		this.setState({
			inputCurrency: selectedCurrency,
			optionsInput: { value: selectedCurrency, label: label },
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
			if (this.mounted) {
				this.setState({ active: '1M' })
			}
		}, 500)
	}

	// Currency output change
	handleCurrencyOutputChange(selectedCurrency, label) {
		if (selectedCurrency === undefined) {
			this.setState({
				outputCurrency: '',
				outputValue: '',
				optionsOutput: { value: '', label: '' },
			})
			toastMessage('Please select output currency', 'warning', 3500)
		} else {
			this.setState({
				outputCurrency: selectedCurrency,
				optionsOutput: {
					value: selectedCurrency,
					label: label,
				},
			})

			const date = new Date(Date.now())
			const start_date = getDate(date)
			const end_date = getDateBefore(date, 1, 'months')
			this.getGraphInfo(end_date, start_date, this.state.inputCurrency, selectedCurrency)
			this.getHistoryGraphInfo(end_date, this.state.inputCurrency, selectedCurrency)
			setTimeout(() => {
				if (this.mounted) {
					this.setState({ active: '1M' })
				}
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
			if (this.mounted) {
				this.setState({ active: '1M' })
			}
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

	handleClick() {
		this.setState({ hasError: false, isLoaded: false })
		this.fetchUserSettings()
			.then((response) => {
				const defaultCurrency = response.default_currency
				if (this.mounted) {
					this.setState({
						inputCurrency: defaultCurrency,
						optionsInput: {
							value: defaultCurrency,
							label: defaultCurrency + ' (' + currenciesName[defaultCurrency] + ')',
						},
					})
				}
				fetchCurrency(defaultCurrency)
					.then((response) => {
						toastMessage('Service Available', 'success', 3500)
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
						const date = new Date(Date.now())
						const start_date = getDate(date)
						const end_date = getDateBefore(date, 1, 'months')

						this.getListExchange(start_date, end_date, this.state.inputCurrency, currencies)
						if (this.mounted) {
							this.setState({
								listCurrency: currencies,
								isLoaded: true,
								hasError: false,
							})
						}
						if (this.state.inputValue && this.state.outputCurrency) {
							if (this.mounted) {
								this.setState({
									outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies),
								})
							}
						}
						this.getGraphInfo(end_date, start_date, this.state.inputCurrency, 'EUR')
						this.getHistoryGraphInfo(end_date, this.state.inputCurrency, 'EUR')
						this.getNewsFeed()
					})
					.catch((error) => {
						if (this.mounted) {
							this.setState({ hasError: true })
						}
					})
			})
			.catch((error) => {
				toastMessage('Service not available, Try Again', 'error', 3500)
				if (this.mounted) {
					this.setState({ hasError: true, isLoaded: true })
				}
			})
	}

	render() {
		const { color, backgroundColor, borderColor, pointBackgroundColor, pointHoverBackgroundColor } = this.props

		if (this.state.hasError) {
			return (
				<>
					<Helmet>
						<title>Financial - Error</title>
					</Helmet>
					<UserHeader welcome={'Dashboard'} message={'Check latest rates and track recent news.'} color={color} borderColor={borderColor} />
					<Container className='mt--7' fluid>
						<Card className='shadow'>
							<CardHeader className='bg-transparent'>
								<Row className='align-items-center'>
									<div className='col'>
										<h5 className='text-uppercase text-muted mb-0 card-title'>Dashboard Financial</h5>
										<span style={{ fontSize: '0.80rem' }}></span>
									</div>
								</Row>

								<div className='text-left justify-content-left'>
									<span style={{ fontSize: '0.80rem' }}>
										&nbsp;
										<br />
										<p className='mt-1 mb-2'>Impossible to fetch Dashboard Information</p>
									</span>
								</div>
								<Button
									style={{ backgroundColor: borderColor, borderColor: borderColor }}
									size='sm'
									className='mt-2 mb-4 ml-1'
									onClick={this.handleClick}>
									{' '}
									Try Again{' '}
								</Button>
							</CardHeader>
							{!this.state.isLoaded && (
								<CardBody>
									{/* Chart */}
									<div className='text-center justify-content-center mt-3'>
										<BarLoader css='display: flex; justify-content: center;' color={'#2E3030'} size={15} />
									</div>
									<div className='chart'></div>
								</CardBody>
							)}
						</Card>
					</Container>
				</>
			)
		}

		if (!this.state.isLoaded) {
			return (
				<>
					<Helmet>
						<title>Financial - Loading</title>
					</Helmet>
					<UserHeader welcome={'Dashboard'} message={'Check latest rates and track recent news.'} color={color} borderColor={borderColor} />
					<Container className='mt--7' fluid>
						<Card className='shadow'>
							<CardHeader className='bg-transparent'>
								<Row className='align-items-center'>
									<div className='col'>
										<h5 className='text-uppercase text-muted mb-0 card-title'>Dashboard Financial</h5>
										<span style={{ fontSize: '0.80rem' }}></span>
									</div>
								</Row>
								<div className='text-left justify-content-left'>
									<span style={{ fontSize: '0.80rem' }}>
										&nbsp;
										<br />
										<BarLoader
											css='display: flex; margin-top: 10px; margin-bottom: 25px; justify-content: center; margin-left:auto; margin-right:auto;'
											color={'#2E3030'}
											size={20}
										/>
									</span>
								</div>
							</CardHeader>
						</Card>
					</Container>
				</>
			)
		} else {
			return (
				<>
					<Helmet>
						<title>Financial - Dashboard</title>
					</Helmet>
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
						getListExchange={this.getListExchange}
						setState={this.setState}
						color={color}
						backgroundColor={backgroundColor}
						borderColor={borderColor}
						pointBackgroundColor={pointBackgroundColor}
						pointHoverBackgroundColor={pointHoverBackgroundColor}
					/>
				</>
			)
		}
	}
}
