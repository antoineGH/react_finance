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
				<p>
					<span className='h2 mb-0' style={{ fontWeight: '650', fontSize: '1.5rem' }}>
						{inputCurrency}
					</span>
					&nbsp;on&nbsp;
					<span className='h2 mb-4' style={{ fontWeight: '650', fontSize: '1.5rem' }}>
						{outputCurrency}
					</span>
				</p>
				{historyPercentage >= 0 ? (
					<>
						<span className='text-success mr-2'>
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
				<h6 style={{ fontSize: '0.8rem' }} className='text-uppercase text-muted ls-1 mb-1 mt-2'>
					Period: <span style={{ fontWeight: '650' }}>{active}</span>&nbsp;&nbsp;
					<span style={{ fontSize: '0.75rem' }} className='text-muted'>
						{start_at} <i className='fa-xs fas fa-chevron-right'></i> {end_at}
					</span>{' '}
				</h6>
			</>
		)
	} else {
		return (
			<div className='reverse_div mt-4'>
				<span style={{ fontSize: '0.80rem' }} class=''>
					Please select currency
				</span>
			</div>
		)
	}
}

// INFO: HISTORICAL CURRENCY
export default function HistoricalPercentage(props) {
	const { isHistoryLoaded, hasHistoryError, outputCurrency, inputCurrency, historyPercentage, start_at, end_at, active } = props

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
						<div className='icon icon-shape bg-info text-white rounded-circle shadow'>
							<i className='fas fa-percent' />
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	)
}
