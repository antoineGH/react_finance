export default function genValues(orderedDates, destCurrency) {
    const graphLegend = []
    const graphValues = []
    for (let [date, value] of Object.entries(orderedDates)) {
        date = date.split('-')
        date = date[2] + '/' + date[1]
        graphLegend.push(date)
        graphValues.push(value[destCurrency])
    }
    return { graphLegend: graphLegend, graphValues: graphValues}
}
