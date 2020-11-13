import React, { Component } from 'react'
import UserHeader from 'components/Headers/UserHeader.js'
import fetchNewsFeed from '../currency/utils/fetchNewsFeed'

export default class FinanceFeed extends Component {
	// --- CLASS CONSTRUCTOR ---
	constructor(props) {
		super(props)
		this.state = {
			newsFeedLoaded: false,
			newsFeedError: false,
			newsFeed: [],
		}
	}

	// --- COMPONENT LIFECYCLE ---
	componentDidMount() {
		this.getNewsFeed()
	}

	// --- CLASS METHODS ---
	getNewsFeed(interests) {
		this.setState({ newsFeedError: false, newsFeedLoaded: false })
		if (!interests) {
			interests = ['Apple', 'Tesla', 'Microsoft']
			fetchNewsFeed('cityfalcon', interests)
				.then((response) => {
					const stories = response.stories
					this.setState({ newsFeedError: false, newsFeedLoaded: true, newsFeed: stories })
				})
				.catch((error) => {
					this.setState({ newsFeedError: true })
				})
			return
		}
	}

	render() {
		const welcome = 'Finance Feed'
		const message = 'Our currency converter calculator will convert your money based on current values from around the world.'

		return (
			<div>
				<UserHeader welcome={welcome} message={message} />
				<p>FinanceFeed</p>
			</div>
		)
	}
}
