import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Row } from 'reactstrap'
import getDateBefore from '../currency/utils/getDateBefore'

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
			pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 93, 93)',
			pointHoverRadius: 8,

			pointHoverBackgroundColor: 'rgb(255, 93, 93)',
			maxTicksLimit: 8,
		}
		this.setState({ style: currency_style })
	}

	render() {
		return (
			<>
				<Card className='shadow'>
					<CardHeader className='bg-transparent'>
						<Row className='align-items-center'>
							<div className='col'>
								<h6 className='text-uppercase text-muted ls-1 mb-1'>
									<span style={{ fontSize: '0.80rem' }}>Period: 1Y </span>({getDateBefore(this.props.graphTitle.end_at, 1, 'years')} -{' '}
									{this.props.graphTitle.end_at})
								</h6>
								<h2 className='mb-0'>
									Historical Exchange Rate{' '}
									<span style={{ fontSize: '0.80rem' }}>
										({this.props.graphTitle.base} - {this.props.graphTitle.dest})
									</span>
								</h2>
							</div>
						</Row>
					</CardHeader>
					<CardBody>
						{/* Chart */}
						<div className='chart'></div>
					</CardBody>
				</Card>
			</>
		)
	}
}
