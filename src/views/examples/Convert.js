import React from 'react'
import UserHeader from 'components/Headers/UserHeader.js'

export default function Convert(props) {
	const { color, borderColor } = props
	const welcome = 'Convert Currency'
	const message = 'Our currency converter calculator will convert your money based on current values from around the world.'

	console.log(props.color)
	return (
		<div>
			<UserHeader welcome={welcome} message={message} color={color} borderColor={borderColor} />
			<p>Convert</p>
		</div>
	)
}
