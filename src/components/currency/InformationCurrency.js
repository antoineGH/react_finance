import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import toCurrency from './utils/toCurrency'

import Button from 'react-bootstrap/Button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

export default function InformationCurrency(props) {

    if (props.state.listCurrency) {
        return (
            <>
                <Row>
                    <Col xs={12} sm={12} md={6}>
                        <p className='mt-3' style={{ fontSize: '1.5rem' }}>1 {props.state.inputCurrency} equals</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={6}>
                        <p style={{ fontSize: '3rem', marginTop: '-4%' }}>{toCurrency(1, props.state.outputCurrency, props.state.listCurrency)} {props.state.outputCurrency}</p>
                    </Col>
                    <Col xs={12} sm={12} md={6}>
                        <Button style={{ borderRadius: '0.15rem', marginTop: '-8%' }} variant='outline-danger' onClick={() => props.reverse()}><FontAwesomeIcon className='mt-1 mr-1' size="1x" icon={['fas', 'chevron-up']} /> Reverse <FontAwesomeIcon className='mt-1 mr-1' size="1x" icon={['fas', 'chevron-down']} /></Button>
                    </Col>
                </Row>
            </>
        );
    }
    return null
}