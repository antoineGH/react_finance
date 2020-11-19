import React from 'react'
import { toast } from 'react-toastify'

export default function toastMessage(message, typeMessage, autoClose) {
	let color = ''
	switch (typeMessage) {
		case 'error':
			color = 'red'
			break
		case 'warning':
			color = 'yellow'
			break
		case 'info':
			color = 'blue'
			break
		default:
			color = 'green'
	}

	const messageDisplay = (
		<p>
			<i style={{ color: color }} className='fas fa-exclamation-circle'></i>&nbsp;&nbsp;{message}
		</p>
	)
	toast[typeMessage](messageDisplay, {
		className: 'Toastify__progress-bar_success',
		position: 'top-right',
		autoClose: autoClose,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	})
}
