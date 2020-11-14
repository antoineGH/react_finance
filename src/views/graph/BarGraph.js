import React, { Component } from 'react'
import Chart from 'chart.js'

// Declare myLineChart and set chart default settings
let myBarChart
let t

export default class BarGraph extends Component {
	barchartRef = React.createRef()

	// --- COMPONENT LIFECYCLE ---
	// call buildChart function on Mount
	componentDidMount() {
		t = setTimeout(() => {
			this.buildChart()
		}, 1200)
	}

	componentWillUnmount() {
		clearTimeout(t)
	}

	// call buildChart function on Update
	componentDidUpdate() {
		t = setTimeout(() => {
			this.buildChart()
		}, 1200)
	}

	shouldComponentUpdate(nextProps) {
		// Component should update if props.graphValues is different than nextProps.graphValue
		if (this.props.graphValues !== nextProps.graphValues) {
			return true
		}

		if (this.props.backgroundColor !== nextProps.backgroundColor) {
			return true
		}

		if (this.props.reload !== nextProps.reload) {
			return true
		}

		// Otherwise component shouldn't update
		return false
	}

	// --- CLASS METHODS ---

	buildChart() {
		const MyBarChartRef = this.barchartRef.current.getContext('2d')
		const { graphValues, graphLegend, style, backgroundColor, borderColor, pointBackgroundColor, pointHoverBackgroundColor } = this.props

		if (typeof myBarChart !== 'undefined') myBarChart.destroy()

		myBarChart = new Chart(MyBarChartRef, {
			type: 'bar',
			data: {
				labels: graphLegend,
				datasets: [
					{
						label: 'Historical Exchange Rate',
						data: graphValues,
						borderColor: borderColor,
						borderWidth: 2,
						backgroundColor: backgroundColor,
						hoverBackgroundColor: pointHoverBackgroundColor,
						hoverBorderColor: pointBackgroundColor,
						hoverBorderWidth: style.hoverBorderWidth,
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
				<canvas id='myCharted' ref={this.barchartRef} />
			</>
		)
	}
}
