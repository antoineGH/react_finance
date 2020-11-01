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
		} = this.props

		return (
			<>
				<Card className='card-stats' style={{ height: '100%' }}>
					<CardBody>
						<Row className='vertical-center reverse_div mt-1'>
							<Col lg='10' xl='10'>
								<Row>
									<Col lg='3' xl='4'>
										<div className='inputValue'>
											{' '}
											<InputValue inputValue={inputValue} onValueChange={onValueChangeInput} />
										</div>
									</Col>
									<Col lg='9' xl='8'>
										<div className='inputCurrency'>
											{' '}
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
								<Row className='mt-3 mt-md-4'>
									<Col lg='3' xl='4'>
										<div className='inputValue'>
											{' '}
											<InputValue inputValue={outputValue} onValueChange={onValueChangeOutput} />{' '}
										</div>
									</Col>
									<Col lg='9' xl='8'>
										<div className='inputCurrency'>
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
								<Button className='reverse' onClick={reverse}>
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
