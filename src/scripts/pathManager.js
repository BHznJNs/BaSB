import pageController from "../components/paging.js"
import { fetchJSON, fetchMD } from "./fetchResources.js"
import articleRender from "./articleRenderer.js"
import indexRender, { newestItemRenderer, directoryItemRenderer } from "./indexRenderer.js"
import dynamicPrefetch from "./importers/prefetch.js"
import { scrollToTop } from "../utils/dom/scrollControl.js"

const mainEl = document.querySelector("main")
const newestHeader = document.querySelector("#newest-header")
const directoryHeader = document.querySelector("#directory-header")
const articleEl = document.querySelector("article")

async function prefetchResources(contents) {
    const currentHash = location.hash.slice(1)
    const tasks = []
    for (const item of contents) {
        if (tasks.length >= 40) {
            break
        }
        if (!item.name.endsWith("/")) {
            continue
        }
        const targetIndexPath = getIndexPathFromHash(currentHash + item.name)
        tasks.push(dynamicPrefetch(targetIndexPath, "fetch"))
    }
    await Promise.all(tasks)
}

function getIndexPathFromHash(hash=location.hash.slice(1)) {
    const dirPath = "./.index/"
    const path = hash
        .split("/")
        .slice(0, -1) // remove the last `/`
    const targetPath = dirPath
        + path.join("+") + "_"
        + pageController.current()
    return targetPath
}

export async function hashChangeEvent(e) {
    if (!location.hash) {
        pathManager.homepage()
        return
    }
    const hash = location.hash.slice(1)
    mainEl.classList.add("disabled")

    if (pathManager.isIn.newestPage()) {
        // open newest page
        const newestIndex = await fetchJSON(getIndexPathFromHash())
        if (!newestIndex) return
        newestHeader.classList.remove("hidden")
        directoryHeader.classList.add("hidden")
        indexRender(newestIndex, newestItemRenderer)
    } else
    if (pathManager.isIn.directory()) {
        // open directory
        const index = await fetchJSON(getIndexPathFromHash())
        if (!index) return
        newestHeader.classList.add("hidden")
        directoryHeader.classList.remove("hidden")
        prefetchResources(index.content)
        indexRender(index, directoryItemRenderer)
    } else
    if (pathManager.isIn.article()) {
        // open article
        articleEl.innerHTML = ""
        const articleContent = await fetchMD("./" + hash)
        if (!articleContent) return
        mainEl.classList.add("hidden")
        articleRender(articleEl, articleContent)
    } else {
        pathManager.homepage()
    }

    mainEl.setAttribute("data-is-root", hash === "static/")
    mainEl.setAttribute("data-is-newest", hash.startsWith("newest/"))
    mainEl.classList.remove("disabled")

    const getHash = url => new URL(url).hash
    if (e instanceof HashChangeEvent
        && pathManager.isIn.directory(getHash(e.oldURL))
        && pathManager.isIn.article(getHash(e.newURL))) {
        // when enters an article from directory
        scrollToTop()
    }
}

window.addEventListener("hashchange", hashChangeEvent)
window.addEventListener("load", hashChangeEvent)

const homepagePath = "static/"
const newestPath = "newest/"
const pathManager = {
    homepage() {
        location.hash = homepagePath
    },

    open(name) {
        location.hash += name
    },
    jumpTo(target) {
        location.hash = target
    },
    parent() {
        if (this.isIn.root() || this.isIn.newestPage()) {
            return homepagePath
        }
        const splited = location.hash.slice(1).split("/")
        if (this.isIn.directory()) {
            return splited.slice(0, -2).join("/") + "/"
        }
        if (this.isIn.article()) {
            return splited.slice(0, -1).join("/") + "/"
        }
        throw new Error("Unexpected hash: " + location.hash)
    },
    isIn: {
        root() {
            return location.hash === "#" + homepagePath
        },
        newestPage() {
            return location.hash === "#" + newestPath
        },
        directory(test) {
            const testTarget = test || location.hash
            return testTarget.startsWith("#static")
                && testTarget.endsWith("/")
        },
        article(test) {
            const testTarget = test || location.hash
            return testTarget.startsWith("#static")
                && testTarget.endsWith(".md")
        }
    }
}
export default pathManager
