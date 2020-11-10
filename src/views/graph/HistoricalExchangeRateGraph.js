import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Row, Button } from 'reactstrap'
import getDateBefore from '../currency/utils/getDateBefore'
import BarGraph from './BarGraph'
import BarLoader from 'react-spinners/BarLoader'

export default class HistoricalExchangeRateGraph extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.handleReload = this.handleReload.bind(this)
		this.state = {
			style: {},
		}
	}
	// --- COMPONENT LIFECYCLE ---
	componentDidMount() {
		this.createMockData()
	}

	componentDidUpdate() {
		if (this.state.reloaded) {
			this.setState({ reloaded: false })
			return true
		}
		return false
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

	handleReload() {
		this.setState({ reloaded: true })
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
									<h5 className='text-uppercase text-muted mb-0 card-title'>
										Historical Exchange Rate ({graphTitle.base} - {graphTitle.dest})
									</h5>
									<p className='mt-1 mb-0 text-muted text-sm'>
										<span className='text-nowrap'>
											1Y: {getDateBefore(graphTitle.end_at, 1, 'years')} <i className='fa-xs fas fa-chevron-right'></i>{' '}
											{graphTitle.end_at}
										</span>
									</p>
									<span style={{ fontSize: '0.80rem' }}></span>
								</div>
							</Row>
							<div className='text-right col-12' style={{ marginTop: '-5%', marginBottom: '2%' }}>
								<Button color='primary ' size='sm' onClick={this.handleReload}>
									<i className='fas fa-sync-alt'></i>
								</Button>
							</div>
						</CardHeader>
						<CardBody>
							{/* Chart */}
							<div className='chart'>
								<BarGraph graphValues={graphHistoryValue} graphLegend={graphHistoryLegend} style={style} />
							</div>
						</CardBody>
					</Card>
				) : (
					<p>lol</p>
				)}
			</>
		)
	}
}
