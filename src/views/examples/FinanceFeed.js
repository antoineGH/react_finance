import React from 'react'
import UserHeader from 'components/Headers/UserHeader.js'

export default function FinanceFeed() {
	const welcome = 'Finance Feed'
	const message = 'Our currency converter calculator will convert your money based on current values from around the world.'
	const background = {
		color: 'linear-gradient(to right, #141e30, #243b55)',
	}
	return (
		<div>
			<UserHeader welcome={welcome} message={message} background={background} />
			<p>FinanceFeed</p>
		</div>
	)
}
