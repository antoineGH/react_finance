import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Row } from 'reactstrap'
import getDateBefore from '../currency/utils/getDateBefore'
import BarGraph from './BarGraph'

export default class HistoricalExchangeRateGraph extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.state = {
			style: {},
		}
	}
	// --- COMPONENT LIFECYCLE ---
	componentDidMount() {
		this.createMockData()
	}

	// --- CLASS METHODS ---
	createMockData() {
		const currency_style = {
			borderColor: 'rgb(255, 93, 93)',
			backgroundColor: 'rgba(255, 10, 13, 0.1)',
			borderWidth: 2,
			hoverBackgroundColor: 'rgb(255, 93, 93)',
			hoverBorderColor: 'rgb(255, 93, 93)',
			hoverBorderWidth: 2,
		}
		this.setState({ style: currency_style })
	}

	render() {
		const { graphHistoryValue, graphHistoryLegend, graphTitle } = this.props
		const style = this.state.style
		return (
			<>
				{this.props.state.inputCurrency && this.props.state.outputCurrency && this.props.state.isHistoryLoaded ? (
					<Card className='shadow'>
						<CardHeader className='bg-transparent'>
							<Row className='align-items-center'>
								<div className='col'>
									<h6 style={{ fontSize: '0.8rem' }} className='text-uppercase text-muted ls-1 mb-1 mt-2'>
										Period: <span style={{ fontWeight: '650' }}>1Y</span>&nbsp;&nbsp;
										<span style={{ fontSize: '0.75rem' }} className='text-muted'>
											{getDateBefore(graphTitle.end_at, 1, 'years')} <i className='fa-xs fas fa-chevron-right'></i> {graphTitle.end_at}
										</span>{' '}
									</h6>
									<h2 className='mb-0'>
										Historical Exchange Rate{' '}
										<span style={{ fontSize: '0.80rem' }}>
											({graphTitle.base} - {graphTitle.dest})
										</span>
									</h2>
								</div>
							</Row>
						</CardHeader>
						<CardBody>
							{/* Chart */}
							<div className='chart'>
								<BarGraph graphValues={graphHistoryValue} graphLegend={graphHistoryLegend} style={style} />
							</div>
						</CardBody>
					</Card>
				) : (
					<Card className='shadow'>
						<CardHeader className='bg-transparent'>
							<Row className='align-items-center'>
								<div className='col'>
									<h6 className='text-uppercase text-muted ls-1 mb-1'>
										<span style={{ fontSize: '0.80rem' }}>Period:</span>
									</h6>
									<h2 className='mb-0'>Historical Exchange Rate </h2>
								</div>
							</Row>
						</CardHeader>
						<CardBody>
							{/* Chart */}
							<div className='chart'></div>
						</CardBody>
					</Card>
				)}
			</>
		)
	}
}
