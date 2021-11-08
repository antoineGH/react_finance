// Fetch Currency Function from European Central Bank
// http://exchangeratesapi.io/
// API Usage :
// GET https://api.exchangeratesapi.io/latest HTTP/1.1
// GET https://api.exchangeratesapi.io/latest?base=USD HTTP/1.1
// GET https://api.exchangeratesapi.io/latest?symbols=USD,GBP HTTP/1.1
// Function Usage :
// fetchCurrency(baseCurrency) return JSON Promise
// response.base (string), response.date (string), response.rates (object)

// const url = `https://api.exchangeratesapi.io/latest?access_key=`
import { authFetch } from 'auth'
const url = `https://flask-finance-api.herokuapp.com/api/exchange/latest`

export default async function fetchCurrency(baseCurrency) {
	// const urlToFetch = `${url}?base=${baseCurrency}`
	const response = await authFetch(url)
	const responseJson = await response.json()

	return new Promise((resolve, reject) => {
		responseJson ? resolve(responseJson) : reject()
	})
}
