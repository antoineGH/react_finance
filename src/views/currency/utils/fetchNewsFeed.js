// Fetch Financial News from Cityfalcon
// https://dev.cityfalcon.com/doc/api/v0.2
// API Usage :
// GET https://sandbox-api.cityfalcon.com/v0.2/stories?identifier_type=assets&identifiers=Apple%2C%20Tesla%2C%20FTSE100&time_filter=mth1&categories=mp%2Cop&min_cityfalcon_score=0&order_by=top&languages=en&all_languages=false&access_token=9e522ad481d49a67ba237d3445b5eea849576a83e8ab46f9911f30406c42f810D HTTP/1.1

// Function Usage :
// fetchNewsFeed(identifier) return JSON Promise
// return response.articles

// Backup Proxy CORS
// https://proxycorsfalcon.herokuapp.com/

const language = 'en'
const access_token = '9e522ad481d49a67ba237d3445b5eea849576a83e8ab46f9911f30406c42f810'

export default async function fetchNewsFeed(identifier_type, identifiers) {
	const identifiersString = identifiers.toString()
	const urlToFetch = `http://proxycorsfalcon.herokuapp.com/${identifier_type}/${identifiersString}/${language}/${access_token}`
	const response = await fetch(urlToFetch, {
		method: 'GET',
	})
	const responseJson = response.json()

	return new Promise((resolve, reject) => {
		response ? resolve(responseJson) : reject()
	})
}
