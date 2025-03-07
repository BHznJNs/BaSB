export default function(el) {
    return function(e) {
        // when Enter key or Space key
        if (e.key === "Enter" || e.key === " ") {
            el.click()
        }
    }
}
