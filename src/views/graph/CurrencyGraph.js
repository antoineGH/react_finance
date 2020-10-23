import React, { Component } from 'react'

import LineGraph from "./LineGraph";

import getDate from '../currency/utils/getDate'
import getDateBefore from '../currency/utils/getDateBefore'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';

import classes from "./CurrencyGraph.module.css";

export default class CurrencyGraph extends Component {

    constructor(props) {
        super(props);
        this.getYear = this.getYear.bind(this);
        this.getSixMonths = this.getSixMonths.bind(this);
        this.getThreeMonths = this.getThreeMonths.bind(this);
        this.getMonth = this.getMonth.bind(this);
        this.getWeek = this.getWeek.bind(this);
        this.getFiveDays = this.getFiveDays.bind(this);
        this.state = {
            style: {},
        };
    }

    componentDidMount() {
        this.createMockData()
    }

    createMockData() {
        const currency_style = {
            borderColor: 'rgb(255, 93, 93)',
            backgroundColor: 'rgba(255, 10, 13, 0.1)',
            pointRadius: 1,
            pointBackgroundColor: 'rgb(255, 93, 93)',
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(255, 93, 93)'
        }
        this.setState({ style: currency_style })
    }

    handleActive(active) {
        this.props.setActive(active)
    }

    getYear() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 1, 'years')
        this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
        this.handleActive('year')
    }

    getSixMonths() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 6, 'months')
        this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
        this.handleActive('6months')
    }

    getThreeMonths() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 3, 'months')
        this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
        this.handleActive('3months')
    }

    getMonth() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 1, 'months')
        this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
        this.handleActive('month')
    }

    getWeek() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 9, 'days')
        this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
        this.handleActive('7days')
    }

    getFiveDays() {
        const date = new Date(Date.now())
        const start_date = getDate(date)
        const end_date = getDateBefore(date, 7, 'days')
        this.props.getGraphInfo(end_date, start_date, this.props.graphTitle.base, this.props.graphTitle.dest)
        this.handleActive('5days')
    }

    render() {

        const { graphValues, graphLegend, graphTitle } = this.props;
        const style = this.state.style

        return (
            <>
                <ListGroup horizontal>
                    <Row className="justify-content-center mt-3 mb-4">
                        <Col xs={11} md={'auto'} style={{ paddingLeft: '0px', paddingRight: '0px' }} className='ml-xs-0 ml-md-3'>
                            <ListGroup.Item className={this.props.active === '5days' && 'active'} action onClick={this.getFiveDays}>5 Days</ListGroup.Item>
                        </Col>
                        <Col xs={11} md={'auto'} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <ListGroup.Item className={this.props.active === '7days' && 'active'} action onClick={this.getWeek}>7 Days</ListGroup.Item>
                        </Col>
                        <Col xs={11} md={'auto'} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <ListGroup.Item className={this.props.active === 'month' && 'active'} action onClick={this.getMonth}>1 Month</ListGroup.Item>
                        </Col>
                        <Col xs={11} md={'auto'} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <ListGroup.Item className={this.props.active === '3months' && 'active'} action onClick={this.getThreeMonths}>3 Months</ListGroup.Item>
                        </Col>
                        <Col xs={11} md={'auto'} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <ListGroup.Item className={this.props.active === '6months' && 'active'} action onClick={this.getSixMonths}>6 Months</ListGroup.Item>
                        </Col>
                        <Col xs={11} md={'auto'} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <ListGroup.Item className={this.props.active === 'year' && 'active'} action onClick={this.getYear}>1 Year</ListGroup.Item>
                        </Col>
                    </Row>
                </ListGroup>

                <Card className='card_graph_currency'>
                    <div className={classes.container}>
                        <LineGraph graphValues={graphValues} graphLegend={graphLegend} graphTitle={graphTitle} style={style} />
                    </div>
                </Card>
            </>
        )
    }
}
