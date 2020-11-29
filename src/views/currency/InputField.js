import React, { Component } from 'react'
import InputValue from '../../views/currency/InputValue'
import InputCurrency from '../../views/currency/InputCurrency'
import { Card, CardBody, Row, Col, Button } from 'reactstrap'

// INFO: INPUT FIELD
export default class InputField extends Component {
	// CLASS CONSTRUCTOR
	constructor(props) {
		super(props)
		this.onCurrencyChangeInput = this.props.onCurrencyChangeInput.bind(this)
		this.onCurrencyChangeOutput = this.props.onCurrencyChangeOutput.bind(this)
		this.onValueChangeInput = this.props.onValueChangeInput.bind(this)
		this.onValueChangeOutput = this.props.onValueChangeOutput.bind(this)
		this.reverse = this.props.reverse.bind(this)
	}

	render() {
		const {
			inputValue,
			outputValue,
			listCurrency,
			valueInput,
			labelInput,
			valueOutput,
			labelOutput,
			onValueChangeInput,
			onValueChangeOutput,
			onCurrencyChangeInput,
			onCurrencyChangeOutput,
			reverse,
			borderColor,
		} = this.props

		return (
			<>
				<Card className='card-stats' style={{ height: '100%' }}>
					<CardBody>
						<Row className='vertical-center reverse_div mt-1'>
							<Col lg='10' xl='10'>
								<div className='col' style={{ paddingLeft: '0px' }}>
									<h5 className='text-uppercase text-muted mb-0 card-title'>
										Convert Currency {valueInput && valueOutput && '(' + valueInput + ' - ' + valueOutput + ')'}
									</h5>
								</div>
								<Row>
									<Col lg='3' xl='4'>
										<div className='inputValue mt-2'>
											{' '}
											<InputValue
												inputValue={inputValue}
												inputCurrency={valueInput}
												onValueChange={onValueChangeInput}
												borderColor={borderColor}
											/>
										</div>
									</Col>
									<Col lg='9' xl='8'>
										<div className='inputCurrency mt-1'>
											<label className='form-control-label' style={{ fontSize: '0.70rem' }} htmlFor='input-username'>
												Select Source Currency
											</label>
											{listCurrency && (
												<InputCurrency
													listCurrency={listCurrency}
													onCurrencyChange={onCurrencyChangeInput}
													options={{
														value: valueInput,
														label: labelInput,
													}}
												/>
											)}
										</div>
									</Col>
								</Row>
								<Row className='mt-1'>
									<Col lg='3' xl='4'>
										<div className='inputValue'>
											{' '}
											<InputValue
												inputValue={outputValue}
												inputCurrency={valueOutput}
												onValueChange={onValueChangeOutput}
												borderColor={borderColor}
											/>{' '}
										</div>
									</Col>
									<Col lg='9' xl='8'>
										<div className='inputCurrency'>
											<label className='form-control-label' style={{ fontSize: '0.70rem' }} htmlFor='input-username'>
												Select Destination Currency
											</label>
											{listCurrency && (
												<InputCurrency
													listCurrency={listCurrency}
													onCurrencyChange={onCurrencyChangeOutput}
													options={{
														value: valueOutput,
														label: labelOutput,
													}}
												/>
											)}{' '}
										</div>
									</Col>
								</Row>
							</Col>
							<Col lg='1' xl='1' className='mx-auto my-auto'>
								<Button
									className='reverse'
									onClick={reverse}
									style={{
										backgroundColor: borderColor,
										borderColor: borderColor,
										color: 'white',
									}}>
									<i className='fas fa-random'></i>
								</Button>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</>
		)
	}
}
