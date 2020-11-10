import React from 'react'
import UserHeader from 'components/Headers/UserHeader.js'

export default function HistoricalGraph() {
	const welcome = 'Historical Exchange Rate Graph'
	const message = 'Historical Foreign Exchange Rates Graph based on current values from around the world.'
	const background = {
		color: 'linear-gradient(to right, #141e30, #243b55)',
	}
	return (
		<div>
			<UserHeader welcome={welcome} message={message} background={background} />
			<p>HistoricalGraph</p>
		</div>
	)
}
