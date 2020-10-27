import React from 'react'
import { CardTitle } from 'reactstrap'
import toCurrency from '../currency/utils/toCurrency'
import ScaleLoader from 'react-spinners/ScaleLoader'

export default function InformationCurrency(props) {
	if (props.state) {
		if (props.state.infoIsLoading) {
			return (
				<div className='ml-3'>
					<ScaleLoader css='display: flex; justify-content: left;' color={'#2E3030'} size={15} />
				</div>
			)
		} else if (props.state.outputCurrency && props.state.inputCurrency) {
			return (
				<>
					<CardTitle tag='h5' className='text-uppercase text-muted mb-0'>
						1 {props.state.inputCurrency} equals
					</CardTitle>
					<span style={{ fontWeight: '650' }} className='h2 mb-0'>
						{toCurrency(1, props.state.outputCurrency, props.state.listCurrency)} {props.state.outputCurrency}
					</span>
				</>
			)
		} else {
			return (
				<div className='select_currency'>
					<span class='h2 font-weight-bold mb-0'>Select currency</span>
				</div>
			)
		}
	}
	return null
}
