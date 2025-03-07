import "../styles/components/catalog.css"
import pathManager from "../scripts/pathManager"
import throttle from "../utils/throttle.js"
import eventbus from "../utils/eventbus/inst.js"
import el from "../utils/dom/el.js"
import { scrollToEl } from "../utils/dom/scrollControl.js"
import importStyle from "../scripts/importers/style"
import keydownEvent from "../utils/dom/keydownEvent"
import debounce from "../utils/debounce"

function catalogItemRenderer({ level, content, id }) {
    const contentEl = el("span", content, {
        "class": "underline-target"
    })
    const itemEl = el("li", contentEl, {
        "class": [
            "level-" + level,
            "underline-through",
        ].join(" "),
        tabindex: 0,
        "data-target-headline": id
    })
    itemEl.onkeydown = keydownEvent(itemEl)
    return itemEl
}

const articleContainer = document.getElementById("article-container")

class Catalog extends HTMLElement {
    rootNode = null
    constructor() {
        super()

        importStyle("./dist/chunks/catalog.min.css")

        this.rootNode = el("ol")
        this.appendChild(this.rootNode)
        this.#appendEvent()
    }

    #scrollCallback() {
        const threshold = 2
        const boundingRect = this.getBoundingClientRect()

        const { top, bottom } = boundingRect
        const isTopStuck = top <= threshold
        const isBottomStuck = window.innerHeight - bottom <= threshold

        this.classList.toggle("top-stuck", isTopStuck)
        this.classList.toggle("bottom-stuck", isBottomStuck)
    }

    #appendEvent() {
        // sticky state change event
        const scrollCallback = this.#scrollCallback.bind(this)
        if ("onscrollend" in window) {
            window.addEventListener("scrollend", scrollCallback)
        } else {
            window.addEventListener("scroll", debounce(scrollCallback, 300))
        }

        // jump to target
        this.rootNode.addEventListener("click", throttle(e => {
            const targetId = e.target.getAttribute("data-target-headline")
            if (!targetId) {
                return
            }
            const targetHeadlineEl = document.getElementById(targetId)
            scrollToEl(targetHeadlineEl, 16)
        }, 200))

        // auto close self
        window.addEventListener("hashchange", () => {
            if (pathManager.isIn.article()) {
                return
            }
            articleContainer.classList.remove("with-catalog")
        })

        eventbus.on("catalog-toggle", () => {
            const isShow = articleContainer.classList.toggle("with-catalog")
            isShow && this.#scrollCallback()
        })
        eventbus.on(
            "article-rendered",
            this.render.bind(this)
        )
    }

    // input: [{ level, content }]
    async render(items) {
        const fragment = document.createDocumentFragment()
        items
            .map(catalogItemRenderer)
            .forEach(el => fragment.appendChild(el))

        this.rootNode.innerHTML = ""
        this.rootNode.appendChild(fragment)
    }
}
customElements.define("article-catalog", Catalog)
