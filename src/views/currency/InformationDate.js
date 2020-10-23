import React from 'react'

import getDatetime from './utils/getDatetime'

export default function InformationDate(props) {
    if (props.state) {
        if (props.state.infoIsLoading) {
            return null
        }
        else if (props.state.date && props.state.outputCurrency && props.state.inputCurrency ) {
            return (
                <p className="mt-3 mb-0 text-muted text-sm">
                    <span className="text-nowrap">{getDatetime(Date.parse(props.state.date))}</span>
                </p>
            );
        }
    }
    return null
}