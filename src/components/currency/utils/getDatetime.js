export default function getDatetime(dt) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const date = new Date(dt);

    const today_date = date.getDate()
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const month = (months[date.getMonth()]).substring(0, 3)
    const year = date.getFullYear()

    const formattedTime = `${month}, ${today_date} ${year} ${hours}:${minutes} UTC`

    return formattedTime
}