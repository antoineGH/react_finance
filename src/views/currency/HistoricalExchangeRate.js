import React, { Component } from 'react'
import { Table } from "reactstrap";

export default class HistoricalExchangeRate extends Component {
    render() {
        const listCurrencyHistory = this.props.listCurrencyHistory
        return (
            <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Base Currency</th>
                            <th scope="col">Destination Currency</th>
                            <th scope="col">Exchange Rate</th>
                            <th scope="col">Historical Exchange Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                    {listCurrencyHistory.map((listCurrency, count) => {
                        count ++
                        const rate = Math.round(listCurrency.rate * 1000) / 1000;
                        return (
                            <tr key={count}>
                                <th scope="row">{listCurrency.baseCurrency}</th>
                                <td>{listCurrency.destCurrency}</td>
                                <td>{rate}</td>
                                <td>
                                    {listCurrency.historyPercentage >= 0 ? <i className="fas fa-arrow-up text-success mr-3" /> : <i className="fas fa-arrow-down text-danger mr-3" />}{" "}
                            {listCurrency.historyPercentage}
                          </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
        );
    }
}
