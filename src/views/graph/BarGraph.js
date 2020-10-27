import React, { Component } from 'react'
import Chart from 'chart.js'

// Declare myLineChart and set chart default settings
let myBarChart

export default class BarGraph extends Component {
	barchartRef = React.createRef()

	// call buildChart function on Mount
	componentDidMount() {
		setTimeout(() => {
			this.buildChart()
		}, 1200)
	}

	// call buildChart function on Update
	componentDidUpdate() {
		setTimeout(() => {
			this.buildChart()
		}, 1200)
	}

	shouldComponentUpdate(nextProps) {
		// Component should update if props.graphValues is different than nextProps.graphValue
		if (this.props.graphValues !== nextProps.graphValues) {
			return true
		}

		// Otherwise component shouldn't update
		return false
	}

	buildChart() {
		const MyBarChartRef = this.barchartRef.current.getContext('2d')
		const { graphValues, graphLegend } = this.props

		if (typeof myBarChart !== 'undefined') myBarChart.destroy()

		myBarChart = new Chart(MyBarChartRef, {
			type: 'bar',
			data: {
				labels: graphLegend,
				datasets: [
					{
						label: 'Historical Exchange Rate',
						backgroundColor: '#3e95cd',
						data: graphValues,
					},
				],
			},
			options: {
				legend: { display: false },
				responsive: true,
				maintainAspectRatio: false,
				tooltips: {
					displayColors: false,
					titleFontSize: 16,
					bodyFontSize: 14,
					xPadding: 10,
					yPadding: 10,
					callbacks: {
						label: (tooltipItem) => {
							return `${tooltipItem.value}%`
						},
					},
				},
			},
		})
	}

	render() {
		return (
			<>
				<canvas id='myChart' ref={this.barchartRef} />
			</>
		)
	}
}
