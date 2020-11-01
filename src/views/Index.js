import React from 'react'
import Header from 'components/Headers/Header.js'
import HistoricalExchangeRate from './currency/HistoricalExchangeRate'
import ExhangeRateGraph from './graph/ExhangeRateGraph'
import HistoricalExchangeRateGraph from './graph/HistoricalExchangeRateGraph'
import NewsFeed from './currency/NewsFeed'
import getDate from './currency/utils/getDate'
import getDateBefore from './currency/utils/getDateBefore'
import { Card, CardHeader, Container, Row, Col } from 'reactstrap'

// INDEX CLASS MANAGE GRAPHS AND ARRAYS
class Index extends React.Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.onValueChangeInput = this.props.onValueChangeInput.bind(this)
		this.onValueChangeOutput = this.props.onValueChangeOutput.bind(this)
		this.onCurrencyChangeInput = this.props.onCurrencyChangeInput.bind(this)
		this.onCurrencyChangeOutput = this.props.onCurrencyChangeOutput.bind(this)
		this.getNewsFeed = this.props.getNewsFeed.bind(this)
		this.reverse = this.props.reverse.bind(this)
		this.setActive = this.props.setActive.bind(this)
		this.getGraphInfo = this.props.getGraphInfo.bind(this)
		this.getListExchange = this.props.getListExchange.bind(this)
		this.setState = this.props.setState.bind(this)
	}

	// --- COMPONENT LIFECYCLE ---

	// --- CLASS METHODS ---

	render() {
		const date = new Date(Date.now())
		const start_date = getDate(date)
		const end_date = getDateBefore(date, 1, 'months')

		return (
			<>
				<Header
					state={this.props.state}
					onValueChangeInput={this.props.onValueChangeInput}
					onValueChangeOutput={this.props.onValueChangeOutput}
					onCurrencyChangeInput={this.props.onCurrencyChangeInput}
					onCurrencyChangeOutput={this.props.onCurrencyChangeOutput}
					reverse={this.props.reverse}
				/>
				<Container className='mt--7' fluid>
					<Row>
						{/* OVERVIEW MAIN GRAPH */}
						<ExhangeRateGraph
							graphValues={this.props.state.graphValues}
							graphLegend={this.props.state.graphLegend}
							graphTitle={this.props.state.graphTitle}
							getGraphInfo={this.getGraphInfo}
							active={this.props.state.active}
							setActive={this.props.setActive}
							state={this.props.state}
						/>
						{/* TOTAL ORDER GRAPH */}
						<Col xl='6'>
							<HistoricalExchangeRateGraph
								graphHistoryValue={this.props.state.graphHistoryValue}
								graphHistoryLegend={this.props.state.graphHistoryDateLegend}
								graphTitle={this.props.state.graphTitle}
								state={this.props.state}
							/>
						</Col>
					</Row>
					<Row className='mt-5'>
						{/* HISTORICAL EXCHANGE RATE */}
						<Col className='mb-5 mb-xl-0' lg={12} xl='4'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='align-items-center'>
										<div className='col'>
											{this.props.state.inputCurrency && (
												<h6 style={{ fontSize: '0.8rem' }} className='text-uppercase text-muted ls-1 mb-1 mt-2'>
													Period: <span style={{ fontWeight: '650' }}>1M</span>&nbsp;&nbsp;
													<span style={{ fontSize: '0.75rem' }} className='text-muted'>
														{end_date} <i className='fa-xs fas fa-chevron-right'></i> {start_date}
													</span>{' '}
												</h6>
											)}
											<h3 className='mb-0'>
												Historical Exchange Rate{' '}
												{this.props.state.inputCurrency && (
													<span style={{ fontSize: '0.80rem' }}>
														From{' '}
														<span style={{ fontWeight: '650' }}>
															<span style={{ fontSize: '1rem' }}>{this.props.state.inputCurrency}</span>
														</span>
													</span>
												)}
											</h3>
										</div>
									</Row>
								</CardHeader>
								<HistoricalExchangeRate
									listCurrencyHistory={this.props.state.listCurrencyHistory}
									listCurrencyLoaded={this.props.state.listCurrencyLoaded}
									listCurrencyError={this.props.state.listCurrencyError}
									getListExchange={this.props.getListExchange}
									inputCurrency={this.props.state.inputCurrency}
									listCurrency={this.props.state.listCurrency}
									setState={this.props.setState}
								/>
							</Card>
						</Col>
						{/* SOCIAL TRAFFIC */}
						<Col lg={12} xl='8'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='align-items-center'>
										<div className='col'>
											<h3 className='mb-0'>Finance News Feed</h3>
										</div>
									</Row>
								</CardHeader>
								<NewsFeed
									newsFeed={this.props.state.newsFeed}
									newsFeedError={this.props.state.newsFeedError}
									newsFeedLoaded={this.props.state.newsFeedLoaded}
									getNewsFeed={this.props.getNewsFeed}
								/>
							</Card>
						</Col>
					</Row>
				</Container>
			</>
		)
	}
}

export default Index
