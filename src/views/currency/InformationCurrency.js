import React from 'react'
import { CardTitle } from 'reactstrap'
import toCurrency from '../currency/utils/toCurrency'
import BarLoader from 'react-spinners/BarLoader'

export default function InformationCurrency(props) {
	if (props.state) {
		if (props.state.infoIsLoading) {
			return (
				<div className='text-center justify-content-center mt-3'>
					<BarLoader css='display: flex; justify-content: center;' color={'#2E3030'} size={15} />
				</div>
			)
		} else if (props.state.outputCurrency && props.state.inputCurrency) {
			return (
				<>
					<span style={{ fontWeight: '650', fontSize: '1rem' }} className='h2 mb-0'>
						1 {props.state.inputCurrency} equals
					</span>
					<br />
					<span style={{ fontWeight: '650', fontSize: '1.5rem' }} className='h2 mb-0'>
						{toCurrency(1, props.state.outputCurrency, props.state.listCurrency)} {props.state.outputCurrency}
					</span>
				</>
			)
		} else {
			return (
				<div className='reverse_div mt-4'>
					<span style={{ fontSize: '0.80rem' }} class=''>
						Please select currency
					</span>
				</div>
			)
		}
	}
	return null
}
