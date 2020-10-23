import React from 'react'

import { usePromiseTracker } from "react-promise-tracker";

import ScaleLoader from "react-spinners/ScaleLoader";

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function LoadingSpinner(props) {
    const { promiseInProgress } = usePromiseTracker();

    return (
        <>
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={8}>
                        {
                            (promiseInProgress === true)
                                ? <ScaleLoader css="margin-top: 20px; margin-bottom: 20px; padding-top: 30px; height: 107px; display: flex; justify-content: center;" margin={2} color={"#2E3030"} size={15} />
                                : null
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}
