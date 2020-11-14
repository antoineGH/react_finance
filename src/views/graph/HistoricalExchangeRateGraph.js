import React, { Component } from 'react'
import { Card, CardHeader, CardBody, Row, Button } from 'reactstrap'
import getDateBefore from '../currency/utils/getDateBefore'
import BarGraph from './BarGraph'

export default class HistoricalExchangeRateGraph extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.handleReload = this.handleReload.bind(this)
		this.state = {
			style: {},
			backgroundColor: localStorage.backgroundColor,
			borderColor: localStorage.borderColor,
			pointBackgroundColor: localStorage.pointBackgroundColor,
			pointHoverBackgroundColor: localStorage.pointHoverBackgroundColor,
			reload: false,
		}
	}
	// --- COMPONENT LIFECYCLE ---

	static getDerivedStateFromProps(props) {
		return {
			backgroundColor: props.backgroundColor,
			borderColor: props.borderColor,
			pointBackgroundColor: props.pointBackgroundColor,
			pointHoverBackgroundColor: props.pointHoverBackgroundColor,
		}
	}

	componentDidMount() {
		this.createMockData()
		this.setState({
			backgroundColor: this.props.backgroundColor,
			borderColor: this.props.borderColor,
			pointBackgroundColor: this.props.pointBackgroundColor,
			pointHoverBackgroundColor: this.props.pointHoverBackgroundColor,
		})
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
		const reload = !this.state.reload
		this.setState({ reload: reload })
	}

	render() {
		const { graphHistoryValue, graphHistoryLegend, graphTitle, borderColor } = this.props
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
								<Button style={{ backgroundColor: borderColor, color: 'white' }} size='sm' onClick={this.handleReload}>
									<i className='fas fa-sync-alt'></i>
								</Button>
							</div>
						</CardHeader>
						<CardBody>
							{/* Chart */}
							<div className='chart'>
								<BarGraph
									graphValues={graphHistoryValue}
									graphLegend={graphHistoryLegend}
									style={style}
									backgroundColor={this.state.backgroundColor}
									borderColor={this.state.borderColor}
									pointBackgroundColor={this.state.pointBackgroundColor}
									pointHoverBackgroundColor={this.state.pointHoverBackgroundColor}
									reload={this.state.reload}
								/>
							</div>
						</CardBody>
					</Card>
				) : (
					<Card className='shadow'>
						<CardHeader className='bg-transparent'>
							<Row className='align-items-center'>
								<div className='col'>
									<h5 className='text-uppercase text-muted mb-0 card-title'>Historical Exchange Rate</h5>
									<p className='mt-1 mb-0 text-muted text-sm'>
										<span className='text-nowrap'>Period</span>
									</p>
									<span style={{ fontSize: '0.80rem' }}></span>
								</div>
							</Row>
							<div className='text-right col-12' style={{ marginTop: '-5%', marginBottom: '2%' }}>
								<Button style={{ backgroundColor: borderColor, color: 'white' }} size='sm' onClick={this.handleReload}>
									<i className='fas fa-sync-alt'></i>
								</Button>
							</div>
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
