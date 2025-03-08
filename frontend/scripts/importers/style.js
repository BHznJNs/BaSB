export default function importStyle(path) {
    return new Promise((resolve, reject) => {
        const linkEl = document.createElement("link")
        linkEl.rel  = "stylesheet"
        linkEl.href = path
        document.head.appendChild(linkEl)

        linkEl.onload = resolve
        linkEl.onerror = reject
    })
}
