import moment from 'moment'

// Function uses moment to substract a days / months / years to a date object 
// Convert it to the format YYYY-MM-DD
// Usage : getDateBefore(dateObject, 7, 'months')
export default function getDateBefore(date, numberofUnit, unit) {
    var startdate = moment(date).subtract(numberofUnit, unit).format("YYYY-MM-DD");
    return startdate
}
