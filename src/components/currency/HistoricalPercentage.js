import React from 'react'

export default function HistoricalPercentage( props ) {
    
    if (props.historyPercentage >= 0) {
    return <p>On that period, <span className='span_currency'>{props.inputCurrency}</span> on <span className='span_currency'>{props.outputCurrency}</span> increase by <span className='span_currency'>{props.historyPercentage}%</span>.</p>
    } else {
    return <p>On that period, <span className='span_currency'>{props.inputCurrency}</span> on <span className='span_currency'>{props.outputCurrency}</span> decrease by <span className='span_currency'>{props.historyPercentage}%</span>.</p>
    }
}
