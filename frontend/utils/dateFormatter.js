export default function(timestamp) {
    const date = new Date(timestamp)
    const formatedDate = new Intl.DateTimeFormat().format(date)
    return formatedDate
}
