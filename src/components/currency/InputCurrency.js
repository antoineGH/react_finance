import React, { Component } from 'react'
import Select from "react-dropdown-select";
import './../../App.css';

export default class InputCurrency extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            search: '',
        }
    }

    handleChange(selected) {
        if (selected[0] === undefined) {
            this.props.onCurrencyChange(undefined)
        } else {
            const selectedCurrency = selected[0].value
            this.props.onCurrencyChange(selectedCurrency)
        }
    }

    customNoDataRenderer = ({ props, state }) => (
        <p>Ooops! nothing found. Please type in currency code.</p>
    )

    render() {

        const listCurrency = this.props.listCurrency

        return (
            <Select
                key={new Date().getTime()}
                
                options={listCurrency}
                values={this.props.options && [this.props.options]}

                onChange={(selected) => this.handleChange(selected)}
                keepSelectedInList={true}
                dropdownHandle={true}
                closeOnSelect={true}
                clearable={true}

                // Manage Loading Currencies in Dropdown.
                loading={listCurrency ? false : true}
                disabled={listCurrency ? false : true}

                // No Data Render Custom Method
                noDataRenderer={this.customNoDataRenderer}

                style={{ borderRadius: '.25rem' }}
            />
        )
    }
}