export default function(callback, waitMillisecond) {
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