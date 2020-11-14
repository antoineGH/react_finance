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
import { currenciesName } from '../currency/utils/currenciesName'
import { Col } from 'react-bootstrap'
import { Card, CardHeader, FormGroup, Row, Container, NavItem, NavLink, Nav, CardBody, Input } from 'reactstrap'
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
			selectedSourceCurrency: 'Default Currency',
			selectedDestCurrency: 'EUR',
			inputValue: '1',
			outputValue: '',
		}
	}

	// --- COMPONENT LIFECYCLE ---

	componentDidMount() {
		this.fetchUserSettings()
			.then((response) => {
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
			.catch((error) => {
				console.log(error)
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

	handleChangeSource(selected) {
		selected && this.setState({ selectedSourceCurrency: selected[0].value })
	}

	handleChangeDestination(selected) {
		selected && this.setState({ selectedDestCurrency: selected[0].value })
	}

	reverse() {
		const selectedSourceCurrency = this.state.selectedSourceCurrency
		const selectedDestCurrency = this.state.selectedDestCurrency
		this.setState({ selectedDestCurrency: selectedSourceCurrency, selectedSourceCurrency: selectedDestCurrency })
	}

	render() {
		const { color, borderColor } = this.props
		const { listCurrency, listCurrencyError, listCurrencyLoaded, selectedSourceCurrency, selectedDestCurrency } = this.state
		const welcome = 'Convert Currency'
		const message = 'Our currency converter calculator will convert your money based on current values from around the world.'
		return (
			<div>
				<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
				<Container className='mt--7' fluid>
					{/* User settings */}
					<div className='pl-lg-4'>
						<Row style={{ width: '100%' }}>
							<Col lg='5'>
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
													// size='sm'
													className='reverse'
													style={{ backgroundColor: borderColor, borderColor: borderColor }}
													onClick={this.reverse}>
													<i className='fas fa-random'></i>
												</Button>
											</Col>
										</Row>
										<Row className='align-items-center'>
											<Col lg='3'>
												<FormGroup className='mt-4'>
													<label className='form-control-label' htmlFor='input-username'>
														Input Value
													</label>
													<Input
														className='inputValue form-control-input'
														type='text'
														value={this.state.inputValue}
														onChange={(e) => this.setState({ inputValue: e.currentTarget.value })}
													/>
												</FormGroup>
											</Col>
											<Col lg='8'>
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
											</Col>
										</Row>

										<Row className='align-items-center'>
											<Col lg='3'>
												<FormGroup className='mt-4'>
													<label className='form-control-label' htmlFor='input-username'>
														Output Value
													</label>
													<Input
														className='inputValue form-control-input'
														type='text'
														value={this.state.outputValue}
														onChange={(e) => this.setState({ outputValue: e.currentTarget.value })}
													/>
												</FormGroup>
											</Col>
											<Col lg='8'>
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
											</Col>
										</Row>
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
