import React from 'react'
import UserHeader from 'components/Headers/UserHeader.js'

export default function HistoricalGraph(props) {
	const { color, borderColor } = props
	const welcome = 'Historical Exchange Rate Graph'
	const message = 'Historical Foreign Exchange Rates Graph based on current values from around the world.'

	return (
		<div>
			<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
			<p>HistoricalGraph</p>
		</div>
	)
}
