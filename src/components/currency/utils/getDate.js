export default function getDate(date) {
    
    const year = date.getFullYear()
    let month = ('0' + date.getMonth()).slice(-2)
    month = parseInt(month) +1
    const today_date = ('0' + date.getDate()).slice(-2)

    const formattedTime = `${year}-${month}-${today_date}`

    return formattedTime
}
