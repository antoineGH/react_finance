import React, { Component } from 'react'
import Pagination from 'react-js-pagination'
import BarLoader from 'react-spinners/BarLoader'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

// INFO: LOAD FUNCTION
class LoadNewsFeed extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.filter = this.props.filter.bind(this)
		this.state = {
			filterMethod: '',
		}
	}
	// --- COMPONENT LIFECYCLE ---

	componentDidUpdate(prevProps) {
		if (this.props.newsFeed !== prevProps.newsFeed) {
			this.handlePageChange(1)
		}

		if (this.props.filterMethod !== prevProps.filterMethod) {
			this.handlePageChange(this.state.activePage)
		}
	}

	shouldComponentUpdate(nextProps) {
		if (this.state.filterMethod !== nextProps.filterMethod) return true
		return false
	}

	// --- CLASS METHODS ---

	filterChild(filterMethod) {
		this.setState({ filterMethod: filterMethod })
		this.props.filter(filterMethod, filterMethod)
	}

	handlePageChange(pageNumber) {
		const { newsFeed } = this.props
		const pageLimit = 10
		const offset = (pageNumber - 1) * pageLimit
		const currentItems = newsFeed.slice(offset, offset + pageLimit)
		this.setState({ activePage: pageNumber, currentItems: currentItems })
	}
	render() {
		let { newsFeed, newsFeedError, newsFeedLoaded } = this.props
		const { currentItems } = this.state

		if (newsFeedError) {
			return (
				<>
					<div className='text-center justify-content-center'>
						<span style={{ fontSize: '0.80rem' }}>&nbsp;Impossible to fetch Finance Feed</span>
					</div>
					<div className='text-center justify-content-center mt-2'>
						<Button size='sm' className='mt-2 mb-4' onClick={this.handleClick}>
							{' '}
							Try Again{' '}
						</Button>
					</div>
				</>
			)
		}

		if (!newsFeedLoaded || this.state.currentItems === undefined) {
			return (
				<>
					<div className='text-center justify-content-center mb-4'>
						<BarLoader css='display: flex; justify-content: center; margin-left:auto; margin-right:auto;' color={'#2E3030'} size={5} />
					</div>
				</>
			)
		} else {
			return (
				<>
					{/* INFO: Pagination */}
					<Row className='text-left  ml-2 mt-md-0 mt-4'>
						<Col className='mt-4 justify-content-left'>
							<Pagination
								hideFirstLastPages
								pageRangeDisplayed={10}
								activePage={this.state.activePage}
								itemsCountPerPage={10}
								totalItemsCount={newsFeed.length}
								onChange={this.handlePageChange.bind(this)}
								itemClass='page-item'
								linkClass='page-link'
							/>
						</Col>
					</Row>
					{/* INFO: Menu Sort By */}
					<Card className='card_filter text-center justify-content-center mx-auto mb-1 mt-md-1 mt-1 border-0'>
						<Card.Body className='card_news_body'>
							<Row>
								<Col xs={3} sm={3} md={3} lg={3} xl={1} className='text-left justify-content-left mr-xl-2'>
									<Button className='btn-sm' onClick={() => this.filter('brandNameAsc')}>
										Brand <i className='fas fa-sort'></i>
									</Button>
								</Col>
								<Col xs={3} sm={3} md={3} lg={3} xl={1} className='mb-2 text-left justify-content-left mr-xl-2'>
									<Row>
										<Button className='btn-sm' onClick={() => this.filter('publishTimeAsc')}>
											Date <i className='fas fa-sort'></i>
										</Button>
									</Row>
								</Col>
								<Col xs={3} sm={3} md={3} lg={3} xl={2}>
									<Row className='text-left mx-auto justify-content-left'>
										<Button className='btn-sm' onClick={() => this.filter('cityfalconScoreAsc')}>
											Score <i className='fas fa-sort'></i>
										</Button>
									</Row>
								</Col>
							</Row>
						</Card.Body>
					</Card>
					{newsFeed.length === 0 && (
						<>
							<Row className='text-left justify-content-left ml-2 mt-md-0 mt-3'>
								<Col>
									<p style={{ color: 'black', fontSize: '0.8rem' }}>No results, please refine your research to assets or tickers</p>
								</Col>
							</Row>
						</>
					)}
					{/* INFO: newsFeed cards */}
					{currentItems.map((info) => {
						return (
							<Card key={info.uuid} className='card_news text-center justify-content-center mx-auto mb-1' style={{ width: '98%' }}>
								<Card.Body className='card_news_body'>
									<Row>
										<Col xs={2} sm={2} md={2} lg={2} xl={1} className='text-left justify-content-left mr-3 mr-xl-2'>
											<img src={info.source.imageUrls.thumb} alt={info.source.brandName} />
										</Col>
										<Col xs={8} sm={8} md={8} lg={8} xl={1} className='mb-2 text-left justify-content-left mr-xl-2'>
											<Row>
												<a href={`https://${info.source.name}`} style={{ fontSize: '0.7rem' }}>
													{info.source.brandName}
												</a>
											</Row>
											<Row style={{ fontSize: '0.7rem', marginTop: '-1%' }} className='text-muted '>
												{info.publishTime.slice(0, 10)}
											</Row>
										</Col>
										<Col xs={12} sm={12} md={12} lg={12} xl={9}>
											<Row className='text-left mx-auto justify-content-left'>
												<a style={{ color: 'black', fontSize: '0.8rem' }} href={info.url}>
													{info.title}
												</a>
											</Row>
											<Row className='text-left mx-auto justify-content-left' style={{ fontSize: '0.7rem' }}>
												{info.description}
											</Row>
										</Col>
									</Row>
								</Card.Body>
							</Card>
						)
					})}
				</>
			)
		}
	}
}

export default class NewsFeed extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.filter = this.filter.bind(this)
		this.searchForm = React.createRef()
		this.state = {
			filterMethod: 'publishTimeDesc',
			search: '',
			interests: '',
		}
	}

	// --- CLASS METHODS ---

	filter(filterMethod) {
		if (this.state.filterMethod === filterMethod) {
			switch (filterMethod) {
				case 'brandNameAsc':
					this.setState({ filterMethod: 'brandNameDesc' })
					return
				case 'cityfalconScoreAsc':
					this.setState({ filterMethod: 'cityfalconScoreDesc' })
					return
				default:
					this.setState({ filterMethod: 'publishTimeDesc' })
					return
			}
		}
		this.setState({ filterMethod: filterMethod })
	}

	handleClick() {
		this.props.getNewsFeed()
	}

	handleSearch() {
		this.props.getNewsFeed(this.state.interests)
		this.searchForm.reset()
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.getNewsFeed(this.state.interests)
	}

	sortBy(filterMethod, newsFeed) {
		switch (filterMethod) {
			case 'brandNameAsc':
				//Sort newsFeed by source.brandName ASC
				newsFeed.sort(function (a, b) {
					if (a.source.brandName > b.source.brandName) return 1
					if (a.source.brandName < b.source.brandName) return -1
					return 0
				})
				return newsFeed

			case 'brandNameDesc':
				//Sort newsFeed by source.brandName DESC
				newsFeed.sort(function (a, b) {
					if (a.source.brandName > b.source.brandName) return -1
					if (a.source.brandName < b.source.brandName) return 1
					return 0
				})
				return newsFeed

			case 'cityfalconScoreAsc':
				//Sort newsFeed by cityfalconScore ASC
				newsFeed.sort(function (a, b) {
					if (a.cityfalconScore > b.cityfalconScore) return 1
					if (a.cityfalconScore < b.cityfalconScore) return -1
					return 0
				})
				return newsFeed

			case 'cityfalconScoreDesc':
				//Sort newsFeed by cityfalconScore DESC
				newsFeed.sort(function (a, b) {
					if (a.cityfalconScore > b.cityfalconScore) return -1
					if (a.cityfalconScore < b.cityfalconScore) return 1
					return 0
				})
				return newsFeed

			case 'publishTimeAsc':
				//Sort newsFeed by publishTime ASC
				newsFeed.sort(function (a, b) {
					if (a.publishTime > b.publishTime) return 1
					if (a.publishTime < b.publishTime) return -1
					return 0
				})
				return newsFeed

			default:
				//Sort newsFeed by publishTime DESC
				newsFeed.sort(function (a, b) {
					if (a.publishTime > b.publishTime) return -1
					if (a.publishTime < b.publishTime) return 1
					return 0
				})
				return newsFeed
		}
	}

	render() {
		let { newsFeed, newsFeedError, newsFeedLoaded } = this.props

		// INFO: newsFeed sortBy
		newsFeed = this.sortBy(this.state.filterMethod, newsFeed)

		// INFO: newsFeed search - if state.search filter the newsfeed array on conditional => string (title or description) include substring (state.search)
		if (this.state.search !== '') {
			if (newsFeed[0].title && newsFeed[0].description) {
				newsFeed = newsFeed.filter(
					(newarr) =>
						newarr.title.toLowerCase().includes(this.state.search.toLowerCase()) ||
						newarr.description.toLowerCase().includes(this.state.search.toLowerCase())
				)
			}
		}
		return (
			<>
				<Col xs={10} sm={8} md={6} lg={6} xl={8} className='mx-lg-1 mb-1 mt-1'>
					{/* INFO: Form Search */}
					<Form className='justify-content-left text-left ml-1' onSubmit={this.handleSubmit}>
						<Row>
							<Col xs={9} sm={8} md={6} lg={6} xl={5}>
								<div className='form-group has-search'>
									<span className='form-control-feedback'>
										<i className='fas fa-search'></i>
									</span>
									<Form.Control
										ref={this.searchForm}
										className='form_filter'
										size='sm'
										type='text'
										id='search'
										placeholder='Search Interests'
										value={this.state.interests}
										onChange={(e) => this.setState({ interests: e.currentTarget.value })}
									/>
								</div>
							</Col>
							<Col xs={2} sm={2} md={6} lg={6} xl={2} className=''>
								<Button className='btn-sm' type='submit' value='Submit'>
									Search
								</Button>
							</Col>
						</Row>
					</Form>
				</Col>
				<Row>
					<Col xs={10} sm={8} md={6} lg={6} xl={6} className='ml-4 mt-2'>
						<p style={{ fontSize: '0.75rem' }} className='text-muted'>
							Search tickers e.g. BTC, TSLA or assets e.g. Bitcoin, Tesla (Comma separated).
						</p>
					</Col>
				</Row>
				{/* INFO: Form Filter */}
				<Col xs={10} sm={8} md={6} lg={6} xl={3} className='mx-lg-1 mb-1 mt-1'>
					<Form noValidate className='justify-content-left text-left mb-1 ml-1'>
						<div className='form-group has-search'>
							<span className='form-control-feedback'>
								<i className='fas fa-filter'></i>
							</span>
							<Form.Control
								className='form_filter'
								size='sm'
								type='text'
								id='search'
								placeholder='Filter Articles'
								value={this.state.search}
								onChange={(e) => this.setState({ search: e.currentTarget.value })}
							/>
						</div>
					</Form>
				</Col>
				<LoadNewsFeed
					newsFeedError={newsFeedError}
					newsFeedLoaded={newsFeedLoaded}
					newsFeed={newsFeed}
					filter={this.filter}
					filterMethod={this.state.filterMethod}
					setState={this.setState}
				/>
			</>
		)
	}
}
