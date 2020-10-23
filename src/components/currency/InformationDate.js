import React from 'react'

import getDatetime from './utils/getDatetime'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function InformationDate(props) {
    if (props.state.date) {
        return (
            <Row>
                <Col xs={12} sm={12} md={6}>
                    {props.state.date && <p className='info_date'>{getDatetime(Date.parse(props.state.date))}</p>}
                </Col>
            </Row>
        );
    }
    return null
}