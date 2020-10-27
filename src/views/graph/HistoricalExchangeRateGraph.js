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
									<h6 className='text-uppercase text-muted ls-1 mb-1'>
										<span style={{ fontSize: '0.80rem' }}>Period: 1Y </span>({getDateBefore(graphTitle.end_at, 1, 'years')} -{' '}
										{graphTitle.end_at})
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
