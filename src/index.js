import "./styles/style.css"
import "./styles/components/skeleton.css"

import "./scripts/mainManager.js"
import pageController from "./components/paging.js"
import pathManager from "./scripts/pathManager"
import { setIframeTheme } from "./scripts/iframeController.js"
import importStyle from "./scripts/importers/style.js"
import { config } from "./utils/loadConfig.js"
import keydownEvent from "./utils/dom/keydownEvent.js"
import eventbus from "./utils/eventbus/inst.js"
import { LiveReloadWSClient } from "./utils/liveReload.js"

importStyle("dist/chunks/skeleton.min.css")

// import optional components
if (config.fab.enable) {
    import("./components/fab.js")
}
if (config.search.enable) {
    import("./components/searchBox.js")
}
if (config.catalog.enable) {
    function passEvent() {
        if (isToShow) {
            eventbus.emit("article-rendered", items)
        }
    }
    let isLoaded = false
    let isToShow = false
    let items = null
    import("./components/catalog.js")
        .then(() => isLoaded = true)
        .then(passEvent)
    
    eventbus.on("article-rendered", _items => {
        if (!isLoaded) {
            isToShow = true
            items = _items
        }
    })
}

// set theme switcher button event
const searchBtn = document.getElementById("search-btn")
const lightBtn  = document.getElementById("light-btn")
const darkBtn   = document.getElementById("dark-btn")
searchBtn.onclick  = () => eventbus.emit("searchbox-show")
lightBtn.onkeydown = keydownEvent(lightBtn)
darkBtn.onkeydown  = keydownEvent(darkBtn)

// --- --- --- --- --- ---

window.addEventListener("popstate", () => {
    if (location.hash.endsWith("/")) {
        // in a directory
        pageController.back()
    }
})

window.addEventListener("beforeunload", e => {
    if (!pathManager.isIn.article()) {
        return
    }
    // when leave an article remember current scroll position
    sessionStorage.setItem("last-leave-page", location.hash)
    sessionStorage.setItem("last-leave-position", window.scrollY)
})

// set embedded iframe theme
const darkmodeObserver = new MutationObserver(setIframeTheme)
darkmodeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"]
})

// set embedded iframe height
window.addEventListener("message", e => {
    if (e.origin != "null") {
        return
    }
    const { id, height } = e.data
    const targetIframeEl = document.getElementById(id)
    targetIframeEl.style.height = height + "px"
})

const wsClient = new LiveReloadWSClient()
wsClient.connect()

if ("serviceWorker" in navigator) {
    // if support service worker, register
    navigator.serviceWorker
        .register("./sw.js")
        .catch(function(error) {
            // registration failed
            console.error("Registration failed with " + error);
        })
}
