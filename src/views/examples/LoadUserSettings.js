import React, { useEffect, useState } from 'react'
import UserHeader from 'components/Headers/UserHeader.js'
import { authFetch } from '../../auth'
import fetchCurrency from '../currency/utils/fetchCurrency'
import { currenciesName } from '../currency/utils/currenciesName'
import Profile from './Profile'
import BarLoader from 'react-spinners/BarLoader'
import { Container, Row, Col } from 'react-bootstrap'
import moment from 'moment'

export default function LoadUserSettings(props) {
	const [isLoaded, setIsLoaded] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [email, setEmail] = useState('')
	const [first_name, setFirstName] = useState('')
	const [last_name, setLastName] = useState('')
	const [username, setUsername] = useState('')
	const [birthday, setBirthday] = useState('')
	const [age, setAge] = useState('')
	const [position, setPosition] = useState('')
	const [education, setEducation] = useState('')
	const [aboutMe, setAboutMe] = useState('')
	const [address, setAddress] = useState('')
	const [city, setCity] = useState('')
	const [postcode, setPostcode] = useState('')
	const [country, setCountry] = useState('')
	const [profilePicture, setProfilePicture] = useState('')

	const [listCurrencyError, setListCurrencyError] = useState([])
	const [listCurrencyLoaded, setListCurrencyLoaded] = useState([])
	const [listCurrency, setListCurrency] = useState([])
	const [selectedCurrency, setSelectedCurrency] = useState('Default Currency')
	const [selectedDBCurrency, setSelectedDBCurrency] = useState('')

	async function fetchUserInfo() {
		const response = await authFetch('https://flask-finance-api.herokuapp.com/api/user', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		let responseJson = undefined
		let errorJson = undefined

		if (response.ok) {
			responseJson = await response.json()
		} else {
			if (response.status === 400) {
				errorJson = await response.json()
			}
			if (response.status === 401) {
				errorJson = await response.json()
			}
		}
		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson.message)
		})
	}

	async function fetchUserSettings() {
		const response = await authFetch('https://flask-finance-api.herokuapp.com/api/user/setting', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		let responseJson = undefined
		let errorJson = undefined

		if (response.ok) {
			responseJson = await response.json()
		} else {
			if (response.status === 400) {
				errorJson = await response.json()
			}
			if (response.status === 401) {
				errorJson = await response.json()
			}
		}
		return new Promise((resolve, reject) => {
			responseJson ? resolve(responseJson) : reject(errorJson.message)
		})
	}

	function toTitleCase(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(function (word) {
				return word.charAt(0).toUpperCase() + word.slice(1)
			})
			.join(' ')
	}

	function calculateAge(birthdate) {
		const day = birthdate.slice(0, 2)
		const month = birthdate.slice(2, 4)
		const year = birthdate.slice(4, birthdate.length)
		birthdate = `${year}-${month}-${day}`
		return moment().diff(birthdate, 'years')
	}

	useEffect(() => {
		let mounted = true
		fetchCurrency('USD')
			.then((response) => {
				const currencies = []
				for (const [prop, value] of Object.entries(response.rates)) {
					const currencyName = '(' + currenciesName[prop] + ')'
					currencies.push({
						value: prop,
						label: `${prop} ${currencyName}`,
						rate: value,
					})
				}
				if (mounted) {
					setListCurrency(currencies)
				}
			})
			.catch((error) => {
				setListCurrencyError(true)
			})
		fetchUserInfo()
			.then((response) => {
				if (mounted) {
					setEmail(response.user.email)
					setFirstName(toTitleCase(response.user.first_name))
					setLastName(toTitleCase(response.user.last_name))
					setUsername(response.user.username)
					setBirthday(response.user.birthdate)
					setAboutMe(response.user.about_me)
					setPosition(response.user.position)
					setEducation(response.user.education)
					setAddress(toTitleCase(response.user.address))
					setCity(toTitleCase(response.user.city))
					setPostcode(response.user.postcode)
					setCountry(toTitleCase(response.user.country))
					setProfilePicture(response.user.profile_picture)
					setAge(calculateAge(response.user.birthdate))
					fetchUserSettings()
						.then((response) => {
							if (mounted) {
								setSelectedCurrency(response.default_currency)
								setSelectedDBCurrency(response.default_currency)
								setListCurrencyLoaded(false)
								setListCurrencyError(false)
								setIsLoaded(true)
							}
						})
						.catch((error) => {
							setHasError(true)
						})
				}
			})
			.catch((error) => {
				setHasError(true)
			})

		return function cleanup() {
			mounted = false
		}
	}, [])

	const welcome = `Hello ${first_name}.`
	const message = 'This is your profile page. You can see and edit your information.'

	return (
		<>
			<UserHeader welcome={welcome} message={message} color={props.color} borderColor={props.borderColor} />
			{hasError && (
				<Container>
					<div className='error_data'>Impossible to fetch data, try again later.</div>
				</Container>
			)}
			{!isLoaded && (
				<Row>
					<Col xs={12} sm={12} md={12} lg={12}>
						<div className='mt-5'>
							<BarLoader
								css='display: flex; margin-top: 45px; justify-content: center; margin-left:auto; margin-right:auto;'
								color={'#2E3030'}
								size={20}
							/>
						</div>
					</Col>
				</Row>
			)}
			{isLoaded && (
				<Profile
					username={username}
					first_name={first_name}
					last_name={last_name}
					email={email}
					birthday={birthday}
					age={age}
					position={position}
					education={education}
					aboutMe={aboutMe}
					address={address}
					city={city}
					postcode={postcode}
					country={country}
					profilePicture={profilePicture}
					color={props.color}
					borderColor={props.borderColor}
					selectedCurrencyProp={selectedCurrency}
					selectedDBCurrency={selectedDBCurrency}
					listCurrency={listCurrency}
					listCurrencyLoaded={listCurrencyLoaded}
					listCurrencyError={listCurrencyError}
					setSelectedCurrency={setSelectedCurrency}
					updateProfilePicture={props.updateProfilePicture}
				/>
			)}
		</>
	)
}
