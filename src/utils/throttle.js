export default function throttle(func, waitMillisecond) {
    let timer = null
    
    return function(...args) {
        if(!timer){
            timer = setTimeout(() => {
                timer = null;
            }, waitMillisecond)
            return func(...args)
        }
    }
}

