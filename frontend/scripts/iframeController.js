const embeddedIframes = () => document.querySelectorAll("iframe[srcdoc]")

export function setIframeRem(fontSize) {
    embeddedIframes().forEach(el =>
        el.contentWindow.postMessage({ fontSize }, "*"))
}

export async function allIframeLoaded() {
    const loadEvents = Array.from(embeddedIframes()).map(el => {
        return new Promise((resolve, _) => el.onload = resolve)
    })
    await Promise.all(loadEvents)
}

export function setIframeTheme() {
    const isDarkMode      = document.body.classList.contains("dark")
    const theme           = isDarkMode ? "dark" : "light"
    embeddedIframes().forEach(el =>
        el.contentWindow.postMessage({ theme }, "*"))
}
