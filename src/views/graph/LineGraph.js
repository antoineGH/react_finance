import React, { Component } from 'react'
import Chart from 'chart.js'

// Declare myLineChart and set chart default settings
let myLineChart
Chart.defaults.global.legend.display = true
Chart.defaults.global.elements.line.tension = 0

export default class LineGraph extends Component {
	chartRef = React.createRef()

	// call buildChart function on Mount
	componentDidMount() {
		this.buildChart()
		const { graphValues, graphLegend, graphTitle } = this.props
		this.setState({ graphLegend: graphLegend, graphTitle: graphTitle, graphValues: graphValues })
	}

	// call buildChart function on Update
	componentDidUpdate() {
		this.buildChart()
	}

	shouldComponentUpdate(nextProps) {
		// Component should update if props.graphValues is different than nextProps.graphValue
		if (this.props.graphValues !== nextProps.graphValues) {
			return true
		}

		// Component should update if props.style is different than nextProps.style
		if (this.props.style.backgroundColor !== nextProps.style.backgroundColor) {
			return true
		}

		if (this.props.backgroundColor !== nextProps.backgroundColor) {
			return true
		}

		// Otherwise component shouldn't update
		return false
	}

	buildChart() {
		const MyChartRef = this.chartRef.current.getContext('2d')
		const { graphValues, graphLegend, graphTitle, style, backgroundColor, borderColor, pointBackgroundColor, pointHoverBackgroundColor } = this.props

		let ratesRounded = []
		if (graphValues) {
			graphValues.forEach((rate) => {
				ratesRounded.push(rate.toFixed(4))
			})
		}

		// Destroy myLineChart is already existing
		if (typeof myLineChart !== 'undefined') myLineChart.destroy()

		myLineChart = new Chart(MyChartRef, {
			type: 'line',
			data: {
				labels: graphLegend,
				datasets: [
					{
						label: `${graphTitle.base} - ${graphTitle.dest}`,
						data: ratesRounded,
						fill: true,
						borderColor: borderColor,
						backgroundColor: backgroundColor,
						pointRadius: style.pointRadius,
						pointBackgroundColor: pointBackgroundColor,
						pointHoverRadius: style.pointHoverRadius,
						pointHoverBackgroundColor: pointHoverBackgroundColor,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [
						{
							ticks: {
								display: true,
								autoSkip: true,
								maxTicksLimit: style.maxTicksLimit,
							},
							gridLines: {
								display: true,
								drawBorder: true,
							},
						},
					],
					yAxes: [
						{
							ticks: {
								maxTicksLimit: 6,
								display: true,
							},
							gridLines: {
								display: true,
								drawBorder: true,
							},
						},
					],
				},
				layout: {
					padding: {
						top: 5,
						left: 15,
						right: 15,
						bottom: 15,
					},
				},
				tooltips: {
					displayColors: false,
					titleFontSize: 16,
					bodyFontSize: 14,
					xPadding: 10,
					yPadding: 10,
					callbacks: {
						label: (tooltipItem) => {
							return `1 ${graphTitle.base} = ${tooltipItem.value} ${graphTitle.dest}`
						},
					},
				},
			},
		})
	}

	render() {
		return (
			<>
				<canvas id='myChart' ref={this.chartRef} />
			</>
		)
	}
}
