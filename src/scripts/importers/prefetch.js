/**
 * @param {string} path 
 * @param {"script" | "style" | "image" | "font" | "fetch"} as_
 */
export default function dynamicPrefetch(path, as_) {
    return new Promise((resolve, reject) => {
        const linkEl = document.createElement("link")
        linkEl.rel = "prefetch"
        linkEl.href = path
        linkEl.as = as_

        if (as_ === 'font') {
            linkEl.crossOrigin = "anonymous"
        }
        document.head.appendChild(linkEl)
        linkEl.onload = resolve
        linkEl.onerror = reject
    })
}
