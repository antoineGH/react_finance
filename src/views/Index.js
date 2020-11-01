import React from 'react'
import Header from 'components/Headers/Header.js'
import HistoricalExchangeRate from './currency/HistoricalExchangeRate'
import ExhangeRateGraph from './graph/ExhangeRateGraph'
import HistoricalExchangeRateGraph from './graph/HistoricalExchangeRateGraph'
import NewsFeed from './currency/NewsFeed'
import { Card, CardHeader, Container, Row, Col } from 'reactstrap'

// INFO: INDEX CLASS MANAGE GRAPHS AND ARRAYS
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

	render() {
		return (
			<>
				<Header
					inputValue={this.props.state.inputValue}
					outputValue={this.props.state.outputValue}
					listCurrency={this.props.state.listCurrency}
					valueInput={this.props.state.optionsInput.value}
					labelInput={this.props.state.optionsInput.label}
					valueOutput={this.props.state.optionsOutput.value}
					labelOutput={this.props.state.optionsOutput.label}
					onValueChangeInput={this.props.onValueChangeInput}
					onValueChangeOutput={this.props.onValueChangeOutput}
					onCurrencyChangeInput={this.props.onCurrencyChangeInput}
					onCurrencyChangeOutput={this.props.onCurrencyChangeOutput}
					reverse={this.props.reverse}
					hasError={this.props.state.hasError}
					infoIsLoading={this.props.state.infoIsLoading}
					outputCurrency={this.props.state.outputCurrency}
					inputCurrency={this.props.state.inputCurrency}
					date={this.props.state.date}
					isHistoryLoaded={this.props.state.isHistoryLoaded}
					hasHistoryError={this.props.state.hasHistoryError}
					historyPercentage={this.props.state.historyPercentage}
					start_at={this.props.state.graphTitle.start_at}
					end_at={this.props.state.graphTitle.end_at}
					active={this.props.state.active}
				/>
				<Container className='mt--7' fluid>
					<Row>
						{/* INFO: EXCHANGE RATE GRAPH */}
						<ExhangeRateGraph
							inputCurrency={this.props.state.inputCurrency}
							graphValues={this.props.state.graphValues}
							graphLegend={this.props.state.graphLegend}
							graphTitle={this.props.state.graphTitle}
							getGraphInfo={this.getGraphInfo}
							active={this.props.state.active}
							setActive={this.props.setActive}
							state={this.props.state}
						/>
						{/* INFO: HISTORICAL EXCHANGE RATE GRAPH */}
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
						{/* INFO: HISTORICAL EXCHANGE RATE ARRAY */}
						<Col className='mb-5 mb-xl-0' lg={12} xl='4'>
							<HistoricalExchangeRate
								listCurrencyHistory={this.props.state.listCurrencyHistory}
								listCurrencyLoaded={this.props.state.listCurrencyLoaded}
								listCurrencyError={this.props.state.listCurrencyError}
								getListExchange={this.props.getListExchange}
								inputCurrency={this.props.state.inputCurrency}
								listCurrency={this.props.state.listCurrency}
								setState={this.props.setState}
							/>
						</Col>
						{/* INFO: FINANCE NEWS FEED */}
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
