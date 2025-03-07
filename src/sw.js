const cacheName = "MarkdownBlog-v0.2.0"
const necessaryResources = [
    "./dist/imgs/sun.svg",
    "./dist/imgs/moon.svg",
    "./dist/imgs/homepage.svg",
    "./dist/imgs/broken-image.svg",
    "./dist/imgs/favicon.png",
]
const optionalResources = [
    /\/dist\/libs\//,
    "./dist/imgs/search.svg",
    "./dist/imgs/rss.svg",
    "./dist/imgs/fab-switch.svg",
    "./dist/imgs/fab-catalog.svg",
    "./dist/imgs/fab-back-to-top.svg",
    "./dist/imgs/fab-back-to-parent.svg",
    "./dist/imgs/fab-zoom-in.svg",
    "./dist/imgs/fab-zoom-out.svg",
]

// get the page URL without hash
function getCleanURL() {
    const href = location.href
    const hashIndex = href.indexOf('#')
    if (hashIndex !== -1) {
        return href.substring(0, hashIndex)
    } else {
        return href
    }
}

// check if the input URL is in the necessary
function isResourceToCache(url, type) {
    const resources = type === "necessary"
        ? necessaryResources
        : optionalResources
    const currentURL = getCleanURL()
    for (const path of resources) {
        if (typeof path === "string") {
            const pathURL = new URL(path, currentURL)
            if (pathURL.href === url) {
                return true
            }
        } else if (path instanceof RegExp) {
            if (path.test(url)) {
                return true
            }
        } else {
            console.error("Unexpected presetted optional resource path: " + path)
        }
    }
    return false
}

self.addEventListener("install", e => {
    console.log("[Service Worker] Installing...")
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName)
        console.log("[Service Worker] Caching all: app shell and content")
        // cache necessary resources
        for (const resource of necessaryResources) {
            try {
                await cache.add(resource)
            } catch(e) {
                console.log("[Service Worker] Cache error when requesting resource " + resource)
                console.error(e)
            }
        }
    })())
})

self.addEventListener("activate", e => {
    e.waitUntil((async () => {
        // delete resources for outdated version
        const keys = await caches.keys()
        await Promise.all(
            keys
                .filter(key => key !== cacheName)
                .map(key => caches.delete(key))
        )
    })())
    console.log("[Service Worker] Activated")
})

// intercepting fetch operations
self.addEventListener("fetch", e => {
    function isSameOrigin(url) {
        const currentURL = new URL(getCleanURL())
        const targetURL  = new URL(url)
        return currentURL.origin === targetURL.origin
    }
    async function returnCachedResource(reqURL) {
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(reqURL)
        if (cachedResponse) {
            // return cached resources directly
            return cachedResponse
        }

        let fetchResponse
        try {
            fetchResponse = await fetch(reqURL, { mode: "no-cors" })
        } catch(err) {
            return new Response("Network error happened: " + err, {
                status: 408,
                headers: { "Content-Type": "text/plain" },
            })
        }
        if (isResourceToCache(reqURL, "option")) {
            // cache optional resources
            cache.put(reqURL, fetchResponse.clone())
        }
        return fetchResponse
    }
    const reqURL = e.request.url
    if (!isSameOrigin(reqURL)) {
        return;
    }
    e.respondWith(returnCachedResource(reqURL))
})
