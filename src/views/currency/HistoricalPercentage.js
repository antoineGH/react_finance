import React from 'react'

export default function HistoricalPercentage(props) {
  if (props.HistoricalPercentage >= 0) {
    return (
      <>
        <span className="text-success mr-2">
          <i className="fas fa-arrow-up" />
            &nbsp;{props.HistoricalPercentage}%.
          </span>{" "}
      </>
    );
  } else {
    return (
      <>
        <span className="text-danger mr-2">
          <i className="fas fa-arrow-down" />
            &nbsp;{props.HistoricalPercentage}%.
          </span>{" "}
      </>
    );
  }
}