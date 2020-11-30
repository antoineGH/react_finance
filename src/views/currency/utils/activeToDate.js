export default function activeToDate(active) {
	let time = active[0]
	let period = active[1]
	switch (period) {
		case 'W':
			return `${time} Week`
		case 'Y':
			return `${time} Year`
		default:
			if (time === '1') return `${time} Month`
			return `${time} Months`
	}
}
