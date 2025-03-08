import pageController from "../components/paging.js"
import keydownEvent from "../utils/dom/keydownEvent.js"
import pathManager from "./pathManager.js"

const mainEl       = document.querySelector("main")
const newest       = mainEl.querySelector("#newest")
const parentDirBtn = mainEl.querySelector("#previous-dir")
const articleList  = mainEl.querySelector("#article-list")

newest.onkeydown = keydownEvent(newest)
parentDirBtn.onkeydown = keydownEvent(parentDirBtn)
parentDirBtn.addEventListener("click", () => {
    pageController.back()
    pathManager.jumpTo(pathManager.parent())
})
articleList.addEventListener("click", e => {
    const target = e.target

    if (target === articleList) {
        // when click on the `articleList` itself
        // ignore this event.
        return
    }

    const relativeData = target.getAttribute("data-relative")
    const jumpToData = target.getAttribute("data-jumpto")
    if (relativeData) {
        if (relativeData.endsWith("/")) {
            pageController.open()
        }
        pathManager.open(relativeData)
    }
    if (jumpToData) {
        // in `newest` page
        pageController.open()
        pathManager.jumpTo(jumpToData)
    }
})
