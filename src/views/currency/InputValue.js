import React, { Component } from 'react'
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

export default class InputValue extends Component {
	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		this.props.onValueChange(event.target.value)
	}

	render() {
		const value = this.props.inputValue
		const inputCurrency = this.props.inputCurrency
		const borderColor = this.props.borderColor

		return (
			<FormGroup>
				<label className='form-control-label' style={{ fontSize: '0.70rem' }} htmlFor='input-username'>
					Input Value
				</label>
				<InputGroup>
					<InputGroupAddon addonType='prepend'>
						<InputGroupText style={{ backgroundColor: borderColor }} className='decoration-input'>
							{inputCurrency}
						</InputGroupText>
					</InputGroupAddon>
					<Input
						className='inputValue form-control-input'
						style={{ paddingLeft: '0.85rem' }}
						type='text'
						value={value}
						onChange={this.handleChange}
					/>
				</InputGroup>
			</FormGroup>
		)
	}
}
