import React, { Component } from 'react'
import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'
import getDateAfter from '../currency/utils/getDateAfter'
import LineGraph from './LineGraph'
import { Card, CardHeader, CardBody, NavItem, NavLink, Nav, Row, Col } from 'reactstrap'

export default class ExhangeRateGraph extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.getYear = this.getYear.bind(this)
		this.getSixMonths = this.getSixMonths.bind(this)
		this.getThreeMonths = this.getThreeMonths.bind(this)
		this.getMonth = this.getMonth.bind(this)
		this.getWeek = this.getWeek.bind(this)
		this.state = {
			style: {},
		}
	}

	// --- COMPONENT LIFECYCLE ---
	componentDidMount() {
		this.createMockData()
	}

	// --- CLASS METHODS ---
	handleActive(active) {
		this.props.setActive(active)
	}

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

	getYear() {
		const currency_style = {
			borderColor: 'rgb(255, 93, 93)',
			backgroundColor: 'rgba(255, 10, 13, 0.1)',
			pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 93, 93)',
			pointHoverRadius: 8,
			pointHoverBackgroundColor: 'rgb(255, 93, 93)',
			maxTicksLimit: 12,
		}
		this.setState({ style: currency_style })
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'years')
		this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
		this.handleActive('1Y')
	}

	getSixMonths() {
		const currency_style = {
			borderColor: 'rgb(255, 93, 93)',
			backgroundColor: 'rgba(255, 10, 13, 0.1)',
			pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 93, 93)',
			pointHoverRadius: 8,
			pointHoverBackgroundColor: 'rgb(255, 93, 93)',
			maxTicksLimit: 6,
		}
		this.setState({ style: currency_style })
		const date = new Date(Date.now())
		const start_date = getDate(date)
		let end_date = getDateBefore(date, 6, 'months')
		end_date = getDateAfter(end_date, 2, 'days')
		this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
		this.handleActive('6M')
	}

	getThreeMonths() {
		const date = new Date(Date.now())
		const start_date = getDate(date)
		let end_date = getDateBefore(date, 3, 'months')
		end_date = getDateAfter(end_date, 2, 'days')
		this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
		this.handleActive('3M')
	}

	getMonth() {
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')
		this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
		this.handleActive('1M')
	}

	getWeek() {
		const currency_style = {
			borderColor: 'rgb(255, 93, 93)',
			backgroundColor: 'rgba(255, 10, 13, 0.1)',
			pointRadius: 1,
			pointBackgroundColor: 'rgb(255, 93, 93)',
			pointHoverRadius: 8,
			pointHoverBackgroundColor: 'rgb(255, 93, 93)',
			maxTicksLimit: 7,
		}
		this.setState({ style: currency_style })
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 9, 'days')
		this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
		this.handleActive('1W')
	}

	render() {
		const { graphValues, graphLegend, graphTitle } = this.props
		const style = this.state.style

		return (
			<>
				<Col className='mb-5 mb-xl-0' xl='6'>
					{this.props.state.inputCurrency && this.props.state.outputCurrency && this.props.state.isHistoryLoaded ? (
						<Card className='bg-gradient-default shadow'>
							<CardHeader className='bg-transparent'>
								<Row className='align-items-center'>
									<div className='col-12 col-lg-6'>
										<h6 style={{ fontSize: '0.8rem' }} className='text-uppercase text-muted ls-1 mb-1 mt-2'>
											Period: <span style={{ fontWeight: '650' }}>{this.props.active}</span>&nbsp;&nbsp;
											<span style={{ fontSize: '0.75rem' }} className='text-muted'>
												{this.props.graphTitle.start_at} <i className='fa-xs fas fa-chevron-right'></i> {this.props.graphTitle.end_at}
											</span>{' '}
										</h6>
										<h2 style={{ color: '#32325d' }} className='text-dark mb-0'>
											Exchange Rate{' '}
											<span style={{ fontSize: '0.80rem' }}>
												({this.props.graphTitle.base} - {this.props.graphTitle.dest})
											</span>
										</h2>
									</div>
									<div className='col-12 col-lg-6 mt-4 mt-xl-0'>
										<Nav className='justify-content-end' pills>
											<NavItem>
												<NavLink className={this.props.active === '1W' ? 'active' : ''} onClick={this.getWeek} href='#'>
													<span className='d-none d-md-block'>1W</span>
													<span className='d-md-none'>1W</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink className={this.props.active === '1M' ? 'active' : ''} onClick={this.getMonth} href='#'>
													<span className='d-none d-md-block'>1M</span>
													<span className='d-md-none'>1M</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink className={this.props.active === '3M' ? 'active' : ''} onClick={this.getThreeMonths} href='#'>
													<span className='d-none d-md-block'>3M</span>
													<span className='d-md-none'>3M</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink className={this.props.active === '6M' ? 'active' : ''} onClick={this.getSixMonths} href='#'>
													<span className='d-none d-md-block'>6M</span>
													<span className='d-md-none'>6M</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink className={this.props.active === '1Y' ? 'active' : ''} onClick={this.getYear} href='#'>
													<span className='d-none d-md-block'>1Y</span>
													<span className='d-md-none'>1Y</span>
												</NavLink>
											</NavItem>
										</Nav>
									</div>
								</Row>
							</CardHeader>
							<CardBody>
								<div className='chart'>
									<LineGraph graphValues={graphValues} graphLegend={graphLegend} graphTitle={graphTitle} style={style} />
								</div>
							</CardBody>
						</Card>
					) : (
						<Card className='bg-gradient-default shadow'>
							<CardHeader className='bg-transparent'>
								<Row className='align-items-center'>
									<div className='col-12 col-lg-6'>
										<h6 className='text-uppercase text-light ls-1 mb-1'>
											<span style={{ fontSize: '0.80rem' }}>Period: </span>
										</h6>
										<h2 className='text-white mb-0'>Exchange Rate </h2>
									</div>
									<div className='col-12 col-lg-6 mt-4 mt-xl-0'>
										<Nav className='justify-content-end' pills>
											<NavItem>
												<NavLink href='#'>
													<span className='d-none d-md-block'>1W</span>
													<span className='d-md-none'>1W</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink href='#'>
													<span className='d-none d-md-block'>1M</span>
													<span className='d-md-none'>1M</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink href='#'>
													<span className='d-none d-md-block'>3M</span>
													<span className='d-md-none'>3M</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink href='#'>
													<span className='d-none d-md-block'>6M</span>
													<span className='d-md-none'>6M</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink href='#'>
													<span className='d-none d-md-block'>1Y</span>
													<span className='d-md-none'>1Y</span>
												</NavLink>
											</NavItem>
										</Nav>
									</div>
								</Row>
							</CardHeader>
							<CardBody>
								<div className='chart'></div>
							</CardBody>
						</Card>
					)}
				</Col>
			</>
		)
	}
}
