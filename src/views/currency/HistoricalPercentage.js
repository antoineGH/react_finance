import React from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'

function LoadHistoricalPercentage(props) {
	const { isHistoryLoaded, hasHistoryError, outputCurrency, inputCurrency, historyPercentage, start_at, end_at, active } = props

	if (hasHistoryError) {
		return (
			<>
				<div className='text-center justify-content-center'>
					<span style={{ fontSize: '0.80rem' }}>&nbsp;Impossible to fetch History</span>
				</div>
			</>
		)
	}

	if (!isHistoryLoaded) {
		return (
			<div className='text-center justify-content-center mt-3'>
				<BarLoader css='display: flex; justify-content: center;' color={'#2E3030'} size={15} />
			</div>
		)
	}

	if (historyPercentage && inputCurrency && outputCurrency) {
		return (
			<>
				<h2 className='h2 mb-0 mt-2' style={{ fontWeight: '650', fontSize: '1.5rem' }}>
					{inputCurrency} on {outputCurrency}
				</h2>
				{historyPercentage >= 0 ? (
					<>
						<span className='text-success mr-2 mt-1'>
							<i className='fas fa-arrow-up' />
							&nbsp;{historyPercentage}%.{' '}
						</span>{' '}
					</>
				) : (
					<>
						<span className='text-danger mr-2'>
							<i className='fas fa-arrow-down' />
							&nbsp;{historyPercentage}%.
						</span>{' '}
					</>
				)}
				<p className='mb-0 text-muted text-sm mt-4'>
					<span className='text-nowrap'>
						{active}: {start_at} <i className='fa-xs fas fa-chevron-right'></i> {end_at}
					</span>
				</p>
			</>
		)
	} else {
		return (
			<div className='reverse_div mt-4'>
				<span style={{ fontSize: '0.80rem' }}>Please select currency</span>
			</div>
		)
	}
}

// INFO: HISTORICAL CURRENCY
export default function HistoricalPercentage(props) {
	const { isHistoryLoaded, hasHistoryError, outputCurrency, inputCurrency, historyPercentage, start_at, end_at, active, borderColor } = props

	return (
		<Card className='card-stats ' style={{ height: '100%' }}>
			<CardBody>
				<Row>
					<div className='col'>
						<CardTitle tag='h5' className='text-uppercase text-muted mb-0'>
							History
						</CardTitle>
						<LoadHistoricalPercentage
							isHistoryLoaded={isHistoryLoaded}
							hasHistoryError={hasHistoryError}
							outputCurrency={outputCurrency}
							inputCurrency={inputCurrency}
							historyPercentage={historyPercentage}
							start_at={start_at}
							end_at={end_at}
							active={active}
						/>
					</div>
					<Col className='col-auto'>
						<div className='icon icon-shape text-white rounded-circle shadow' style={{ backgroundColor: borderColor }}>
							<i className='fas fa-percent' />
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	)
}
