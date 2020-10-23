import React, { Component } from 'react'

import InputCurrency from './InputCurrency'
import InputValue from './InputValue'
import InformationCurrency from './InformationCurrency'
import InformationDate from './InformationDate'
import CurrencyGraph from '../graph/CurrencyGraph'
import HistoricalPercentage from './HistoricalPercentage'

import ScaleLoader from "react-spinners/ScaleLoader";

import fetchCurrency from './utils/fetchCurrency'
import toCurrency from './utils/toCurrency'
import fromCurrency from './utils/fromCurrency'
import { currenciesName } from './utils/currenciesName'
import sortDate from './utils/sortDate'
import genValues from './utils/genValues'
import getDate from './utils/getDate'
import getDateBefore from './utils/getDateBefore'
import fetchHistoryCurrency from './utils/fetchHistoryCurrency'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

function DisplayInformationCurrency(props) {
    const state = props.state

    if (state.infoIsLoading) {
        return (
            <div className='mt-5 ml-5'>
                <ScaleLoader css="display: flex; justify-content: left;" color={"#2E3030"} size={15} />
            </div>
        );

    } else if (state.outputCurrency && state.inputCurrency) {
        return (
            <>
                <InformationCurrency state={state} reverse={props.reverse}/>
                <InformationDate state={state} />
            </>
        );
    } else {
        return (<div className='select_currency'>
            <p>Please select currency.</p>
        </div>);
    }
}

export default class Currency extends Component {

    // --- CLASS CONSTRUCTOR ---

    constructor(props) {
        super(props);
        this.handleCurrencyInputChange = this.handleCurrencyInputChange.bind(this);
        this.handleCurrencyOutputChange = this.handleCurrencyOutputChange.bind(this);
        this.handleValueInputChange = this.handleValueInputChange.bind(this);
        this.handleValueOutputChange = this.handleValueOutputChange.bind(this);
        this.getGraphInfo = this.getGraphInfo.bind(this);
        this.setActive = this.setActive.bind(this);
        this.reverse = this.reverse.bind(this);
        this.state = {
            isLoaded: false,
            hasError: false,

            isHistoryLoaded: false,
            hasHistoryError: false,

            infoIsLoading: false,

            listCurrency: '',
            inputCurrency: 'USD',
            outputCurrency: 'EUR',
            date: '',
            inputValue: '1',
            outputValue: '',
            historyPercentage : '',

            active: 'month',
            graphLegend: {},
            graphValues: {},
            graphTitle: {},

            optionsInput: { value: "USD", label: "USD" },
            optionsOutput: { value: "EUR", label: "EUR" }
        }
    }

    // --- COMPONENT LIFECYCLE ---

    componentDidMount() {
        fetchCurrency('USD')
            .then(response => {
                this.setState({ date: response.date })
                const currencies = []
                for (const [prop, value] of Object.entries(response.rates)) {
                    const currencyName = '(' + currenciesName[prop] + ')'
                    currencies.push({
                        value: prop,
                        label: `${prop} ${currencyName}`,
                        rate: value
                    })
                }
                this.setState({ listCurrency: currencies, isLoaded: true, hasError: false })
                if (this.state.inputValue && this.state.outputCurrency) {
                    this.setState({ outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies) })
                }
            })
            .catch(error => {
                console.log(error)
                this.setState({ hasError: true })
            })

        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 1, 'months')
        this.getGraphInfo(end_date, start_date, 'USD', 'EUR')
    }

    // --- CLASS METHODS --- 

    // Set base
    setBase(selectedCurrency) {
        this.setState({ infoIsLoading: true })
        fetchCurrency(selectedCurrency)
            .then(response => {
                this.setState({ date: response.date })
                const currencies = []
                for (const [prop, value] of Object.entries(response.rates)) {
                    const currencyName = '(' + currenciesName[prop] + ')'
                    currencies.push({
                        value: prop,
                        label: `${prop} ${currencyName}`,
                        rate: value
                    })
                }
                this.setState({ listCurrency: currencies, isLoaded: true, hasError: false, infoIsLoading: false })
                if (this.state.inputValue && this.state.outputCurrency) {
                    this.setState({ outputValue: toCurrency(this.state.inputValue, this.state.outputCurrency, currencies) })
                }
            })
            .catch(error => {
                console.log(error)
                this.setState({ hasError: true, infoIsLoading: false })
            })
    }

    // Get Graph Info
    getGraphInfo(startDate, endDate, baseCurrency, destCurrency) {
        fetchHistoryCurrency(startDate, endDate, baseCurrency, destCurrency)
            .then(response => {
                const graphTitle = { base: baseCurrency, dest: destCurrency, start_at: startDate, end_at: endDate }

                // Sort Object of objects with Date as a key
                const orderedDates = sortDate(response)

                const historyPercentage = this.getHistoryPercentage(orderedDates, destCurrency, startDate, endDate)

                // Generate Arrays for Rates Values and Date.
                const { graphLegend, graphValues } = genValues(orderedDates, destCurrency)
                // Update State                
                this.setState({ graphLegend: graphLegend, graphValues: graphValues, graphTitle: graphTitle, isHistoryLoaded: true, historyPercentage: historyPercentage })
            })
            .catch(error => {
                console.log(error)
                this.setState({ hasHistoryError: true })
            })
    }

    // Currency input change
    handleCurrencyInputChange(selectedCurrency) {
        if (selectedCurrency === undefined) {
            this.setState({ inputCurrency: '', outputValue: '', optionsInput: { value: "", label: "" }})
            return
        }
        this.setState({ inputCurrency: selectedCurrency, optionsInput: { value: selectedCurrency, label: selectedCurrency } })
        this.setBase(selectedCurrency)
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 1, 'months')

        if (this.state.outputCurrency === '') {
            this.getGraphInfo(end_date, start_date, selectedCurrency, 'EUR')
        } else {
            this.getGraphInfo(end_date, start_date, selectedCurrency, this.state.outputCurrency)
        }
        setTimeout(() => {
            this.setState({ active: 'month' })
        }, 500)
    }

    // Currency output change
    handleCurrencyOutputChange(selectedCurrency) {
        if (selectedCurrency === undefined) {
            this.setState({ outputCurrency: '', outputValue: '', optionsOutput: { value: "", label: "" } })
        } else {
            this.setState({ outputCurrency: selectedCurrency, optionsOutput: { value: selectedCurrency, label: selectedCurrency } })

            // Updating History 
            const date = new Date(Date.now())
            const start_date = getDate(date)
            const end_date = getDateBefore(date, 1, 'months')
            this.getGraphInfo(end_date, start_date, this.state.inputCurrency, selectedCurrency)
            setTimeout(() => {
                this.setState({ active: 'month' })
            }, 500)

            if (this.state.inputValue && this.state.inputCurrency) {
                this.setState({ outputValue: toCurrency(this.state.inputValue, selectedCurrency, this.state.listCurrency) })
            }
        }
    }

    // Value input change
    handleValueInputChange(value) {
        this.setState({ inputValue: value })
        if (this.state.inputCurrency && this.state.outputCurrency) {
            this.setState({ outputValue: toCurrency(value, this.state.outputCurrency, this.state.listCurrency) })
        }
    }

    // Value output change
    handleValueOutputChange(value) {
        this.setState({ outputValue: value })
        if (this.state.inputCurrency && this.state.outputCurrency) {
            this.setState({ inputValue: fromCurrency(value, this.state.outputCurrency, this.state.listCurrency) })
        }
    }

    // Handle Active
    setActive(active) {
        this.setState({ active: active })
    }

    // Reverse 
    reverse() {
        const { inputCurrency, outputCurrency, optionsInput, optionsOutput } = this.state
        if (!inputCurrency || !outputCurrency) { return }
        this.setState({ inputCurrency: outputCurrency, outputCurrency: inputCurrency, optionsInput: optionsOutput, optionsOutput: optionsInput })
        this.setBase(outputCurrency)

        // Updating History 
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 1, 'months')
        this.getGraphInfo(end_date, start_date, outputCurrency, inputCurrency)
        setTimeout(() => {
            this.setState({ active: 'month' })
        }, 500)
    }

    // Calculate Historical %
    getHistoryPercentage(orderedDates, destCurrency, startDate, endDate) {
        // Get Yesterday
        const endDateMinusOne = getDateBefore(endDate, 1, 'days')
        
        const t0 = orderedDates[startDate][destCurrency]
        const t1 = orderedDates[endDateMinusOne][destCurrency]
        
        // Formula Historical Evolution % = ((t1 - t0) / t0) * 100
        let historyPercentage = ((t1 - t0) / t0) * 100
        historyPercentage = Math.round(historyPercentage * 10000) / 10000;
        return historyPercentage
    }


    // --- RENDER ---
    render() {
        const listCurrency = this.state.listCurrency;
        if (this.state.hasError) {
            return (
                <Container>
                    <div className='error_data'>
                        <FontAwesomeIcon className='mt-1 mr-1' size="lg" icon={['fas', 'times']} />
                        Impossible to fetch data, try again later.
                    </div>
                </Container>
            );
        }

        if (!this.state.isLoaded) {
            return (
                <>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={8}>
                            <div className="mt-5">
                                <ScaleLoader css="display: flex; justify-content: center;" color={"#2E3030"} size={15} />
                            </div>
                        </Col>
                    </Row>
                </>
            );
        } else {
            return (
                <Container>
                    <Row>
                        <Col className='top_pannel'>
                            <DisplayInformationCurrency state={this.state} reverse={this.reverse} />
                        </Col>
                    </Row>

                    {/* Input Value & Currency */}
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={8}>
                            <Row>
                                <Col xs={12} sm={3} md={3} lg={3} className='inputValue my-auto'>
                                    <InputValue inputValue={this.state.inputValue} onValueChange={this.handleValueInputChange} />
                                </Col>
                                <Col xs={12} sm={9} md={5} lg={5} className='inputCurrency mt-2 mt-sm-0' >
                                    <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyInputChange} options={{ value: this.state.optionsInput.value, label: this.state.optionsInput.label }} />
                                </Col>
                            </Row>

                            {/* Output Value & Currency */}
                            <Row className='mt-sm-3'>
                                <Col xs={12} sm={3} md={3} lg={3} className='mt-4 mt-sm-0 inputValue'>
                                    <InputValue inputValue={this.state.outputValue} onValueChange={this.handleValueOutputChange} />
                                </Col>
                                <Col xs={12} sm={9} md={5} lg={5} className='inputCurrency mt-2 mt-sm-0'>
                                    <InputCurrency listCurrency={listCurrency} onCurrencyChange={this.handleCurrencyOutputChange} options={{ value: this.state.optionsOutput.value, label: this.state.optionsOutput.label }} />
                                </Col>
                            </Row>

                            {/* Display Graph */}
                            <Row className='justify-content-center text-center mt-2 mt-md-5'>
                                <Col>
                                    {this.state.inputCurrency && this.state.outputCurrency && this.state.isHistoryLoaded && <CurrencyGraph graphValues={this.state.graphValues} graphLegend={this.state.graphLegend} graphTitle={this.state.graphTitle} getGraphInfo={this.getGraphInfo} active={this.state.active} setActive={this.setActive} />}
                                </Col>
                            </Row>
                            {/* Display Historical % Value */}
                            <HistoricalPercentage historyPercentage={this.state.historyPercentage} inputCurrency={this.state.inputCurrency} outputCurrency={this.state.outputCurrency} />
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
}
