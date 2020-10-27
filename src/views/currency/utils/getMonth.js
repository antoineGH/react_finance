export default function getMonth(date) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
	const monthIndex = date.slice(5, 7)
	return months[monthIndex - 1]
}
