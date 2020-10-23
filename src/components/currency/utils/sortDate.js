import moment from 'moment';

export default function sortDate(response) {
    const orderedDates = []
    Object.keys(response.rates).sort(function (a, b) {
        return moment(a, 'YYYY-MM-DD').toDate() - moment(b, 'YYYY-MM-DD').toDate();
    }).forEach(function (key) {
        orderedDates[key] = response.rates[key];
    })
    return orderedDates
}
