function addLeadingZero(num, target) {
    let numStr = num.toString();
    while (numStr.length < target) {
        numStr = "0" + numStr
    }
    return numStr;
}

const weekDayNames = [
    "Sun", "Mon", "Tue",
    "Wed", "Thu", "Fri",
    "Sat",
]
const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec",
]
const getWeekDay  = date => weekDayNames[date.getDay()]
const getMonth    = date => monthNames[date.getMonth()]
const getTime     = date => `${addLeadingZero(date.getHours(), 2)}:${addLeadingZero(date.getMinutes(), 2)}:00`;
const getTimezone = () => {
    const timezone = (-(new Date()).getTimezoneOffset() / 60)
    return (timezone >= 0 ? "+" : "-") + addLeadingZero((timezone * 100).toString(), 4)
}

export function rssTimeFormatter(timestamp) {
    const date           = new Date(timestamp)
    const weekDay        = getWeekDay(date)
    const day_month_year = `${date.getDate()} ${getMonth(date)} ${date.getFullYear()}`
    const time           = getTime(date)
    const timezone       = getTimezone(date)
    return `${weekDay}, ${day_month_year} ${time} ${timezone}`
}
