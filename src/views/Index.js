import React from 'react'
import Header from 'components/Headers/Header.js'
import HistoricalExchangeRate from './currency/HistoricalExchangeRate'
import ExhangeRateGraph from './graph/ExhangeRateGraph'
import HistoricalExchangeRateGraph from './graph/HistoricalExchangeRateGraph'
import { Button, Card, CardHeader, Progress, Table, Container, Row, Col } from 'reactstrap'

// INDEX CLASS MANAGE GRAPHS AND ARRAYS
class Index extends React.Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.onValueChangeInput = this.props.onValueChangeInput.bind(this)
		this.onValueChangeOutput = this.props.onValueChangeOutput.bind(this)
		this.onCurrencyChangeInput = this.props.onCurrencyChangeInput.bind(this)
		this.onCurrencyChangeOutput = this.props.onCurrencyChangeOutput.bind(this)
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
						<Col className='mb-5 mb-xl-0' xl='8'>
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
						<Col xl='4'>
							<Card className='shadow'>
								<CardHeader className='border-0'>
									<Row className='align-items-center'>
										<div className='col'>
											<h3 className='mb-0'>Social traffic</h3>
										</div>
										<div className='col text-right'>
											<Button color='primary' href='#pablo' onClick={(e) => e.preventDefault()} size='sm'>
												See all
											</Button>
										</div>
									</Row>
								</CardHeader>
								<Table className='align-items-center table-flush' responsive>
									<thead className='thead-light'>
										<tr>
											<th scope='col'>Referral</th>
											<th scope='col'>Visitors</th>
											<th scope='col' />
										</tr>
									</thead>
									<tbody>
										<tr>
											<th scope='row'>Facebook</th>
											<td>1,480</td>
											<td>
												<div className='d-flex align-items-center'>
													<span className='mr-2'>60%</span>
													<div>
														<Progress max='100' value='60' barClassName='bg-gradient-danger' />
													</div>
												</div>
											</td>
										</tr>
										<tr>
											<th scope='row'>Facebook</th>
											<td>5,480</td>
											<td>
												<div className='d-flex align-items-center'>
													<span className='mr-2'>70%</span>
													<div>
														<Progress max='100' value='70' barClassName='bg-gradient-success' />
													</div>
												</div>
											</td>
										</tr>
										<tr>
											<th scope='row'>Google</th>
											<td>4,807</td>
											<td>
												<div className='d-flex align-items-center'>
													<span className='mr-2'>80%</span>
													<div>
														<Progress max='100' value='80' />
													</div>
												</div>
											</td>
										</tr>
										<tr>
											<th scope='row'>Instagram</th>
											<td>3,678</td>
											<td>
												<div className='d-flex align-items-center'>
													<span className='mr-2'>75%</span>
													<div>
														<Progress max='100' value='75' barClassName='bg-gradient-info' />
													</div>
												</div>
											</td>
										</tr>
										<tr>
											<th scope='row'>twitter</th>
											<td>2,645</td>
											<td>
												<div className='d-flex align-items-center'>
													<span className='mr-2'>30%</span>
													<div>
														<Progress max='100' value='30' barClassName='bg-gradient-warning' />
													</div>
												</div>
											</td>
										</tr>
									</tbody>
								</Table>
							</Card>
						</Col>
					</Row>
				</Container>
			</>
		)
	}
}

export default Index
