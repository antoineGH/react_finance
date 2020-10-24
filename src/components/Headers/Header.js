import React from "react";
import HistoryPercentage from '../../views/currency/HistoricalPercentage'
import InformationCurrency from '../../views/currency/InformationCurrency'
import InputValue from '../../views/currency/InputValue'
import InputCurrency from '../../views/currency/InputCurrency'
import InformationDate from '../../views/currency/InformationDate'

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col, Button } from "reactstrap";

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.onCurrencyChangeInput = this.props.onCurrencyChangeInput.bind(this);
    this.onCurrencyChangeOutput = this.props.onCurrencyChangeOutput.bind(this);
    this.onValueChangeInput = this.props.onValueChangeInput.bind(this);
    this.onValueChangeOutput = this.props.onValueChangeOutput.bind(this);
    this.reverse = this.props.reverse.bind(this);
  }
  render() {
    return (

      // Bootstrap Breakpoints
      // @media (max-width: 575.98px) { ... }
      // @media (max-width: 767.98px) { ... }
      // @media (max-width: 991.98px) { ... }
      // @media (max-width: 1199.98px) { ... }
      // Col xs={12} sm={12} md={6}

      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>
                {/* --- Input Field Card --- */}
                <Col lg="12" xl="6">
                  <Card className="card-stats" style={{ height: '100%' }}>
                    <CardBody>
                      <Row className='vertical-center reverse_div'>
                        <Col lg="10" xl="10">
                          <Row>
                            <Col lg="3" xl="4">
                              <div className='inputValue'> {this.props.state && <InputValue inputValue={this.props.state.inputValue} onValueChange={this.props.onValueChangeInput} />}</div>
                            </Col>
                            <Col lg="9" xl="8">
                              <div className='inputCurrency'> {this.props.state && <InputCurrency listCurrency={this.props.state.listCurrency} onCurrencyChange={this.props.onCurrencyChangeInput} options={{ value: this.props.state.optionsInput.value, label: this.props.state.optionsInput.label }} />}</div>
                            </Col>
                          </Row>
                          <Row className='mt-3 mt-md-4'>
                            <Col lg="3" xl="4">
                              <div className='inputValue'> {this.props.state && <InputValue inputValue={this.props.state.outputValue} onValueChange={this.props.onValueChangeOutput} />} </div>
                            </Col>
                            <Col lg="9" xl="8">
                              <div className='inputCurrency'>{this.props.state && <InputCurrency listCurrency={this.props.state.listCurrency} onCurrencyChange={this.props.onCurrencyChangeOutput} options={{ value: this.props.state.optionsOutput.value, label: this.props.state.optionsOutput.label }} />} </div>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg="1" xl="1" className='mx-auto my-auto'>
                          <Button className='reverse' onClick={this.props.reverse}><i className="fas fa-random"></i></Button>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                {/* --- Information Currency Field --- */}
                <Col lg="6" xl="3" className='mt-4 mt-xl-0'>
                  <Card className="card-stats" style={{ height: '100%' }}>
                    <CardBody>
                      <Row>
                        <div className="col">
                          <InformationCurrency state={this.props.state} />
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                            <i className="fas fa-chart-bar" />
                          </div>
                        </Col>
                      </Row>
                      <InformationDate state={this.props.state} />
                    </CardBody>
                  </Card>
                </Col>
                {/* --- HIstorical Value Field --- */}
                <Col lg="6" xl="3" className='mt-4 mt-xl-0'>
                  <Card className="card-stats " style={{ height: '100%' }}>
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-muted mb-0"
                          >
                            History
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {this.props.state.inputCurrency && this.props.state.outputCurrency &&
                              <p>
                                <span className="h2 font-weight-bold mb-0">
                                  {this.props.state.inputCurrency}
                                </span>
                                &nbsp;on&nbsp;
                                  <span className="h2 font-weight-bold mb-0">
                                  {this.props.state.outputCurrency}
                                </span>
                              </p>
                            }
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i className="fas fa-percent" />
                          </div>
                        </Col>
                      </Row>
                      {this.props.state.historyPercentage &&
                        <>
                          <p className="mb-0 text-muted text-sm">
                            <HistoryPercentage HistoricalPercentage={this.props.state.historyPercentage} />
                          </p>
                          <p className="mb-0 text-muted text-sm">
                            <span className="text-nowrap">Since last {this.props.state.active}</span>
                          </p>
                        </>
                      }
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default Header;
