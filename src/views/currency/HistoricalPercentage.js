import React from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'

function LoadHistoricalPercentage(props) {
	const { isHistoryLoaded, hasHistoryError, outputCurrency, inputCurrency, historyPercentage, start_at, end_at, active, cardColor } = props

	if (hasHistoryError) {
		return (
			<>
				<div className='text-center justify-content-center'>
					<span style={{ fontSize: '0.80rem', color: cardColor && 'white' }}>&nbsp;Impossible to fetch History</span>
				</div>
			</>
		)
	}

	if (!isHistoryLoaded) {
		return (
			<div className='text-center justify-content-center mt-3'>
				<BarLoader css='display: flex; justify-content: center;' color={cardColor ? 'white' : '#2E3030'} size={15} />
			</div>
		)
	}

	if (historyPercentage && inputCurrency && outputCurrency) {
		return (
			<>
				<Row>
					<Col className='mt-0 mt-xl-3'>
						<h2 className='h2' style={{ fontWeight: '650', fontSize: '1.5rem', color: cardColor && 'white' }}>
							{inputCurrency} per {outputCurrency}
						</h2>
						{historyPercentage >= 0 ? (
							<>
								<span className='text-success mr-2 mt-1' style={{ fontWeight: '650', fontSize: '1.3rem' }}>
									<i className='fas fa-arrow-up' />
									&nbsp;{historyPercentage}%.{' '}
								</span>{' '}
							</>
						) : (
							<>
								<span className='text-danger mr-2' style={{ fontWeight: '600', fontSize: '1.3rem' }}>
									<i className='fas fa-arrow-down' />
									&nbsp;{historyPercentage}%.
								</span>{' '}
							</>
						)}
					</Col>
				</Row>
				<Row className='mt-0 mt-xl-3'>
					<Col>
						<div className='mt-3'>
							<span className={cardColor ? 'text-white text-nowrap text-sm' : 'text-muted text-sm text-nowrap mt-0 mt-xl-2'}>
								European Central Bank
							</span>
							<p className={cardColor ? 'text-white text-nowrap text-sm' : 'text-nowrap text-muted text-sm'}>
								{active}: {start_at} <i className='fa-xs fas fa-chevron-right'></i> {end_at}
							</p>
						</div>
					</Col>
				</Row>
			</>
		)
	} else {
		return (
			<div className='reverse_div mt-4'>
				<span style={{ fontSize: '0.80rem', color: cardColor && 'white' }}>Please select currency</span>
			</div>
		)
	}
}

// INFO: HISTORICAL CURRENCY
export default function HistoricalPercentage(props) {
	const { isHistoryLoaded, hasHistoryError, outputCurrency, inputCurrency, historyPercentage, start_at, end_at, active, borderColor, cardColor } = props

	return (
		<Card className='card-stats' style={{ height: '100%', background: cardColor && cardColor, border: 0 }}>
			<CardBody>
				<Row>
					<div className='col'>
						<CardTitle tag='h5' className={cardColor ? 'text-uppercase text-white mb-0' : 'text-uppercase text-muted mb-0'}>
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
							cardColor={cardColor}
						/>
					</div>
					<Col className='col-auto'>
						<div className='icon icon-shape text-white rounded-circle shadow' style={{ backgroundColor: borderColor }}>
							<i style={{ fontSize: '0.9rem' }} className='fas fa-percent' />
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	)
}
