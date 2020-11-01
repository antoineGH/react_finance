import React from 'react'
import HistoryPercentage from '../../views/currency/HistoricalPercentage'
import InformationCurrency from '../../views/currency/InformationCurrency'
import InputValue from '../../views/currency/InputValue'
import InputCurrency from '../../views/currency/InputCurrency'

import { Card, CardBody, Container, Row, Col, Button } from 'reactstrap'

// HEADER CLASS MANAGE CARDS
class Header extends React.Component {
	constructor(props) {
		super(props)
		this.onCurrencyChangeInput = this.props.onCurrencyChangeInput.bind(this)
		this.onCurrencyChangeOutput = this.props.onCurrencyChangeOutput.bind(this)
		this.onValueChangeInput = this.props.onValueChangeInput.bind(this)
		this.onValueChangeOutput = this.props.onValueChangeOutput.bind(this)
		this.reverse = this.props.reverse.bind(this)
	}

	render() {
		return (
			<>
				<div className='header bg-gradient-info pb-8 pt-5 pt-md-8'>
					<Container fluid>
						<div className='header-body'>
							<Row>
								{/* INFO: INPUT FIELD */}
								<Col lg='12' xl='6'>
									<Card className='card-stats' style={{ height: '100%' }}>
										<CardBody>
											<Row className='vertical-center reverse_div mt-1'>
												<Col lg='10' xl='10'>
													<Row>
														<Col lg='3' xl='4'>
															<div className='inputValue'>
																{' '}
																{this.props.state && (
																	<InputValue
																		inputValue={this.props.state.inputValue}
																		onValueChange={this.props.onValueChangeInput}
																	/>
																)}
															</div>
														</Col>
														<Col lg='9' xl='8'>
															<div className='inputCurrency'>
																{' '}
																{this.props.state && (
																	<InputCurrency
																		listCurrency={this.props.state.listCurrency}
																		onCurrencyChange={this.props.onCurrencyChangeInput}
																		options={{
																			value: this.props.state.optionsInput.value,
																			label: this.props.state.optionsInput.label,
																		}}
																	/>
																)}
															</div>
														</Col>
													</Row>
													<Row className='mt-3 mt-md-4'>
														<Col lg='3' xl='4'>
															<div className='inputValue'>
																{' '}
																{this.props.state && (
																	<InputValue
																		inputValue={this.props.state.outputValue}
																		onValueChange={this.props.onValueChangeOutput}
																	/>
																)}{' '}
															</div>
														</Col>
														<Col lg='9' xl='8'>
															<div className='inputCurrency'>
																{this.props.state && (
																	<InputCurrency
																		listCurrency={this.props.state.listCurrency}
																		onCurrencyChange={this.props.onCurrencyChangeOutput}
																		options={{
																			value: this.props.state.optionsOutput.value,
																			label: this.props.state.optionsOutput.label,
																		}}
																	/>
																)}{' '}
															</div>
														</Col>
													</Row>
												</Col>
												<Col lg='1' xl='1' className='mx-auto my-auto'>
													<Button className='reverse' onClick={this.props.reverse}>
														<i className='fas fa-random'></i>
													</Button>
												</Col>
											</Row>
										</CardBody>
									</Card>
								</Col>
								{/* INFO: INFORMATION CURRENCY FIELD */}
								<Col lg='6' xl='3' className='mt-4 mt-xl-0'>
									<InformationCurrency
										hasError={this.props.state.hasError}
										infoIsLoading={this.props.state.infoIsLoading}
										outputCurrency={this.props.state.outputCurrency}
										inputCurrency={this.props.state.inputCurrency}
										listCurrency={this.props.state.listCurrency}
										date={this.props.state.date}
									/>
								</Col>
								{/* INFO: HISTORICAL CURRENCY */}
								<Col lg='6' xl='3' className='mt-3 mt-xl-0'>
									<HistoryPercentage
										isHistoryLoaded={this.props.state.isHistoryLoaded}
										hasHistoryError={this.props.state.hasHistoryError}
										outputCurrency={this.props.state.outputCurrency}
										inputCurrency={this.props.state.inputCurrency}
										historyPercentage={this.props.state.historyPercentage}
										start_at={this.props.state.graphTitle.start_at}
										end_at={this.props.state.graphTitle.end_at}
										active={this.props.state.active}
									/>
								</Col>
							</Row>
						</div>
					</Container>
				</div>
			</>
		)
	}
}

export default Header
