import React from 'react'
import Header from 'components/Headers/Header.js'
import HistoricalExchangeRate from './currency/HistoricalExchangeRate'
import ExhangeRateGraph from './graph/ExhangeRateGraph'
import HistoricalExchangeRateGraph from './graph/HistoricalExchangeRateGraph'
import NewsFeed from './currency/NewsFeed'
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
	}

	// --- COMPONENT LIFECYCLE ---

	// --- CLASS METHODS ---

	render() {
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
						<Col className='mb-5 mb-xl-0' xl='4'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='align-items-center'>
										<div className='col'>
											<h3 className='mb-0'>Historical Exchange Rate</h3>
										</div>
									</Row>
								</CardHeader>
								<HistoricalExchangeRate listCurrencyHistory={this.props.state.listCurrencyHistory} state={this.props.state} />
							</Card>
						</Col>
						{/* SOCIAL TRAFFIC */}
						<Col xl='8'>
							{/* <Card className='shadow' style={{ height: '28.3vh' }}> */}
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
