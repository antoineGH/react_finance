import React from 'react'
import UserHeader from 'components/Headers/UserHeader.js'

export default function HistoricalRate() {
	const welcome = 'Historical Exchange Rate'
	const message = 'Foreign Exchange Rates Historical Search.'
	const background = {
		color: 'linear-gradient(to right, #141e30, #243b55)',
	}
	return (
		<div>
			<UserHeader welcome={welcome} message={message} background={background} />
			<p>HistoricalRate</p>
		</div>
	)
}
