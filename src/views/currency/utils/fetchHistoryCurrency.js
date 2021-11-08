// Fetch History Currency Function from European Central Bank
// http://exchangeratesapi.io/
// API Usage :
// GET https://api.exchangeratesapi.io/history?start_at=2018-01-01&end_at=2018-09-01&base=USD HTTP/1.1
// GET https://api.exchangeratesapi.io/history?start_at=2018-01-01&end_at=2018-09-01&base=USD&symbols=EUR HTTP/1.1

// Function Usage :
// fetchCurrency(baseCurrency) return JSON Promise
// response.base (string), response.date (string), response.rates (object)

// const url = `https://api.exchangeratesapi.io/history?access_key=`
import { authFetch } from 'auth'
const url = `https://flask-finance-api.herokuapp.com/api/exchange/history`

export default async function fetchHistoryCurrency(startDate, endDate, baseCurrency, destCurrency) {
	const urlToFetch = `${url}?date=${startDate}&symbols=${destCurrency}`
	const response = await authFetch(urlToFetch)
	const responseJson = await response.json()

	return new Promise((resolve, reject) => {
		responseJson ? resolve(responseJson) : reject()
	})
}
