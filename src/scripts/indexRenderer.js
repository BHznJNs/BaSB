import articleRender from "./articleRenderer.js"
import el from "../utils/dom/el.js"
import keydownEvent from "../utils/dom/keydownEvent.js"
import { scrollToTop } from "../utils/dom/scrollControl.js"
import dateFormatter from "../utils/dateFormatter.js"

export function newestItemRenderer(item) {
    const titleEl = el("span", item.title, {
        "class": "underline-target"
    })
    const dateEl  = el("code", dateFormatter(item.createTime))
    return el("li", [titleEl, dateEl], {
        "class": "underline-through",
        "data-jumpto": item.link,
        tabindex: 0,
    })
}
export function directoryItemRenderer(item) {
    const titleEl = el("span", item.name, {
        "class": "underline-target"
    })
    const codeEl = el("code", dateFormatter(item.modifyTime))
    return el("li", [titleEl, codeEl], {
        "class": "underline-through",
        "data-relative": item.name,
        tabindex: 0,
    })
}

const mainEl           = document.querySelector("main")
const articleEl        = document.querySelector("article")
const articleList      = mainEl.querySelector("#article-list")
const dirDescriptionEl = mainEl.querySelector("#directory-description")
const updateTimeEl     = mainEl.querySelector("#update-time code")
const pagingComponent  = mainEl.querySelector("paging-view")

export default function indexRender(index, itemResolver) {
    const {current, total, updateTime} = index
    pagingComponent.setPage(current, total)

    // --- --- --- --- --- ---

    // reset directory description
    dirDescriptionEl.innerHTML = ""
    if ("dirDescription" in index) {
        articleRender(dirDescriptionEl, index.dirDescription)
    }

    updateTimeEl.textContent = updateTime ? dateFormatter(updateTime) : ""

    // reset articleList content
    const fragment = document.createDocumentFragment()
    index.content
        .map(itemResolver)
        .forEach(el => fragment.appendChild(el))
    articleList.innerHTML = ""
    articleList.appendChild(fragment)

    // set keyboard event
    articleList.querySelectorAll("[tabindex='0']").forEach((el) => {
        el.onkeydown = keydownEvent(el)
    })

    // --- --- --- --- --- ---

    articleEl.innerHTML = ""
    mainEl.classList.remove("hidden")
    scrollToTop()
}
