import React from 'react'
import HistoryPercentage from '../../views/currency/HistoricalPercentage'
import InformationCurrency from '../../views/currency/InformationCurrency'
import InputField from '../../views/currency/InputField'

import { Container, Row, Col } from 'reactstrap'

// INFO: HEADER CLASS MANAGE CARDS
class Header extends React.Component {
	// --- CLASS CONSTRUCTOR ---
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
			hasError,
			infoIsLoading,
			outputCurrency,
			inputCurrency,
			date,
			isHistoryLoaded,
			hasHistoryError,
			historyPercentage,
			start_at,
			end_at,
			active,
		} = this.props
		return (
			<>
				<div className='header bg-gradient-info pb-8 pt-5 pt-md-8'>
					<Container fluid>
						<div className='header-body'>
							<Row>
								{/* INFO: INPUT FIELD */}
								<Col lg='12' xl='6'>
									<InputField
										inputValue={inputValue}
										outputValue={outputValue}
										listCurrency={listCurrency}
										valueInput={valueInput}
										labelInput={labelInput}
										valueOutput={valueOutput}
										labelOutput={labelOutput}
										onValueChangeInput={onValueChangeInput}
										onValueChangeOutput={onValueChangeOutput}
										onCurrencyChangeInput={onCurrencyChangeInput}
										onCurrencyChangeOutput={onCurrencyChangeOutput}
										reverse={reverse}
									/>
								</Col>
								{/* INFO: INFORMATION CURRENCY FIELD */}
								<Col lg='6' xl='3' className='mt-4 mt-xl-0'>
									<InformationCurrency
										hasError={hasError}
										infoIsLoading={infoIsLoading}
										outputCurrency={outputCurrency}
										inputCurrency={inputCurrency}
										listCurrency={listCurrency}
										date={date}
									/>
								</Col>
								{/* INFO: HISTORICAL CURRENCY */}
								<Col lg='6' xl='3' className='mt-3 mt-xl-0'>
									<HistoryPercentage
										isHistoryLoaded={isHistoryLoaded}
										hasHistoryError={hasHistoryError}
										outputCurrency={outputCurrency}
										inputCurrency={inputCurrency}
										historyPercentage={historyPercentage}
										start_at={start_at}
										end_at={end_at}
										active={active}
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
