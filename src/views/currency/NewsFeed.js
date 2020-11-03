import React, { Component } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

export default class NewsFeed extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.handleClick = this.handleClick.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.searchForm = React.createRef()
		this.state = {
			filterMethod: 'publishTimeDesc',
			search: '',
			interests: '',
		}
	}

	// --- CLASS METHODS ---
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

	filter(filterMethod) {
		// Toggle Functionnality
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

		if (!newsFeedLoaded) {
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
					{/* INFO: Form Search */}
					<Row>
						<Col xs={10} sm={8} md={6} lg={6} xl={6} className='mx-auto mx-lg-1 ml-lg-3 mt-3'>
							<Form className='justify-content-left text-left mb-2 ml-1' onSubmit={this.handleSubmit}>
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
										placeholder='Search Interests (Comma separated)'
										value={this.state.interests}
										onChange={(e) => this.setState({ interests: e.currentTarget.value })}
									/>
									<Form.Text className='text-muted'>Search tickers e.g. BTC, GOOG, TSLA or assets e.g. Bitcoin, Google, Tesla.</Form.Text>
								</div>
							</Form>
						</Col>
						<Col xs={10} sm={8} md={6} lg={6} xl={2} className='mx-auto mx-lg-1 mt-3'>
							<Button className='btn-sm' type='submit' value='Submit'>
								Search
							</Button>
						</Col>
					</Row>
					{/* INFO: Form Filter */}
					<Col xs={10} sm={8} md={6} lg={6} xl={2} className='mx-auto mx-lg-1 mt-4'>
						<Form noValidate className='justify-content-left text-left mb-2 ml-1'>
							<div className='form-group has-search'>
								<span className='form-control-feedback'>
									<i className='fas fa-search'></i>
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
					{/* INFO: Menu Filter */}
					<Card className='card_filter text-center justify-content-center mx-auto mb-1 border-0'>
						<Card.Body className='card_news_body'>
							<Row>
								<Col xs={3} sm={3} md={3} lg={3} xl={1} className='text-left justify-content-left mr-5 mr-sm-3 mr-xl-2'>
									<Button className='btn-sm' onClick={() => this.filter('brandNameAsc')}>
										Brand{' '}
										{this.state.filterMethod === 'brandNameAsc' ? (
											<i className='fas fa-sort-alpha-down'></i>
										) : (
											<i className='fas fa-sort-alpha-up'></i>
										)}
									</Button>
								</Col>
								<Col xs={3} sm={3} md={3} lg={3} xl={1} className='mb-2 text-left justify-content-left mr-xl-2'>
									<Row>
										<Button className='btn-sm' onClick={() => this.filter('publishTimeAsc')}>
											Date{' '}
											{this.state.filterMethod === 'publishTimeAsc' ? (
												<i className='fas fa-sort-numeric-down'></i>
											) : (
												<i className='fas fa-sort-numeric-up'></i>
											)}
										</Button>
									</Row>
								</Col>
								<Col xs={3} sm={3} md={3} lg={3} xl={2}>
									<Row className='text-left mx-auto justify-content-left'>
										<Button className='btn-sm' onClick={() => this.filter('cityfalconScoreAsc')}>
											Score{' '}
											{this.state.filterMethod === 'cityfalconScoreAsc' ? (
												<i className='fas fa-sort-numeric-down'></i>
											) : (
												<i className='fas fa-sort-numeric-up'></i>
											)}
										</Button>
									</Row>
								</Col>
							</Row>
						</Card.Body>
					</Card>
					{newsFeed.length === 0 && (
						<>
							<Row className='text-left justify-content-left ml-2 mt-3'>
								<Col>
									<p style={{ color: 'black', fontSize: '0.8rem' }}>No results, please refine your research to assets or tickers</p>
									<p style={{ fontSize: '0.70rem', lineHeight: '0.5rem' }}> e.g. BTC, GOOG, TSLA, Bitcoin, Google, Tesla.</p>
								</Col>
							</Row>
						</>
					)}
					{/* INFO: newsFeed cards */}
					{newsFeed.map((info) => {
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
