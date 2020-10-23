import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

export default class InputValue extends Component {

    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onValueChange(event.target.value)
    }

    render() {
        const value = this.props.inputValue

        return (
            <Form.Control className='inputValue' type="text" value={value} onChange={this.handleChange} />
        )
    }
}
