import React from 'react'
import UserHeader from 'components/Headers/UserHeader.js'

export default function RateGraph(props) {
	const { color, borderColor } = props
	const welcome = 'Exchange Rate Graph'
	const message = 'Foreign Exchange Rates Graph based on current values from around the world..'

	return (
		<div>
			<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
			<p>RateGraph</p>
		</div>
	)
}
