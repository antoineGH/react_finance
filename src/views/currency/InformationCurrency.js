import React from 'react'
import toCurrency from '../currency/utils/toCurrency'
import getDatetime from './utils/getDatetime'
import BarLoader from 'react-spinners/BarLoader'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'

// INFO: LOAD FUNCTION
function LoadInformationCurrency(props) {
	const { infoIsLoading, outputCurrency, inputCurrency, listCurrency, hasError, date } = props
	if (hasError) {
		return (
			<>
				<div className='text-center justify-content-center'>
					<span style={{ fontSize: '0.80rem' }}>&nbsp;Impossible to fetch Foreign Exchange Rate</span>
				</div>
			</>
		)
	}

	if (infoIsLoading) {
		return (
			<div className='text-center justify-content-center mt-3'>
				<BarLoader css='display: flex; justify-content: center;' color={'#2E3030'} size={15} />
			</div>
		)
	}

	if (!inputCurrency || !outputCurrency) {
		return (
			<div className='reverse_div mt-4'>
				<span style={{ fontSize: '0.80rem' }}>Please select currency</span>
			</div>
		)
	} else {
		return (
			<>
				<p style={{ fontWeight: '650', fontSize: '1rem' }} className='h2 mb-0 mt-1'>
					1 {inputCurrency} equals
				</p>

				<h2 style={{ fontWeight: '650', fontSize: '1.5rem' }} className='h2 mt-0 mb-0'>
					{toCurrency(1, outputCurrency, listCurrency)} {outputCurrency}
				</h2>
				<p className='mt-1 mb-0 text-muted text-sm'>
					<span className='text-nowrap'>European Central Bank</span>
				</p>
				{date && (
					<p className='mb-0 text-muted text-sm'>
						<span className='text-nowrap'>{getDatetime(Date.parse(date))}</span>
					</p>
				)}
			</>
		)
	}
}

// INFO: INFORMATION CURRENCY FIELD
export default function InformationCurrency(props) {
	const { infoIsLoading, outputCurrency, inputCurrency, listCurrency, hasError, date, borderColor } = props

	return (
		<Card className='card-stats' style={{ height: '100%' }}>
			<CardBody>
				<Row>
					<div className='col'>
						<CardTitle tag='h5' className='text-uppercase text-muted mb-0'>
							Exchange Rate
						</CardTitle>
						<LoadInformationCurrency
							infoIsLoading={infoIsLoading}
							outputCurrency={outputCurrency}
							inputCurrency={inputCurrency}
							listCurrency={listCurrency}
							hasError={hasError}
							date={date}
						/>
					</div>
					<Col className='col-auto'>
						<div className='icon icon-shape text-white rounded-circle shadow' style={{ backgroundColor: borderColor }}>
							<i className='fas fa-chart-bar' />
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	)
}
