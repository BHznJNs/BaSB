export default function debounce(callback, waitMillisecond) {
    let timer = null

    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            return callback(...args)
        }, waitMillisecond)
    }
}