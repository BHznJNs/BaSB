import { hashChangeEvent } from "../scripts/pathManager.js"
import el from "../utils/dom/el.js"
import languageSelector from "../utils/languageSelector.js"

class PageController {
    #pageList = [1]

    current = () => this.#pageList[this.length() - 1]
    next    = () => this.#pageList[this.length() - 1] += 1
    prev    = () => this.#pageList[this.length() - 1] -= 1
    jumpTo  = targetPage => this.#pageList[this.length() - 1] = Number(targetPage)
    length  = () => this.#pageList.length

    back() {
        // called when "popstate" event emited
        this.#pageList.pop()
        if (!this.#pageList.length) {
            this.#pageList.push(1)
        }
    }
    open() {
        // called when enter directory
        this.#pageList.push(1)
    }
}
const pageController = new PageController()
export default pageController

// --- --- --- --- --- ---

const btn = content => el("button",
    el("span", content, {
        "class": "underline-target"
    }), {
    "class": "icon-btn underline-side"
})

class PagingView extends HTMLElement {
    #elements = {}

    constructor() {
        super()

        this.#elements.input = el("input", "1", {
            type: "number",
            min: 1,
            max: 1,
        })
        this.#elements.maxPage = el("span", "1")
        const prevBtn = this.#elements.prevBtn = btn(languageSelector("上一页", "Prev"))
        const nextBtn = this.#elements.nextBtn = btn(languageSelector("下一页", "Next"))
        prevBtn.id = "prev-btn"; prevBtn.classList.add("left")
        nextBtn.id = "next-btn"; nextBtn.classList.add("right")

        const labelEl = el("label", [
            this.#elements.input,
            el("text", "/"),
            this.#elements.maxPage,
        ])
        this.#appendEvent()
        for (const el of [prevBtn, labelEl, nextBtn]) {
            this.appendChild(el)
        }
    }
    #appendEvent() {
        this.#elements.input.addEventListener("keydown", e => {
            if (e.key !== "Enter") {
                return
            }
            const targetPageStr = e.target.value
            if (!/^\d+$/.test(targetPageStr)) {
                e.target.value = 1
                return
            }
            const targetPage = Number(targetPageStr)
            if (!(targetPage > 0 && targetPage <= this.#elements.input.max)) {
                e.target.value = 1
                return
            }
            pageController.jumpTo(targetPage)
            hashChangeEvent()
        })
        this.#elements.prevBtn.addEventListener("click", () => {
            if (pageController.current() > 0) {
                pageController.prev()
                hashChangeEvent()
            }
        })
        this.#elements.nextBtn.addEventListener("click", () => {
            if (pageController.current() < this.#elements.input.max) {
                pageController.next()
                hashChangeEvent()
            }
        })
    }
    setPage(current, total) {
        let isFirstPage = false
        let isLastPage  = false
        let isOnlyPage  = false
        if (total === 1) {
            isOnlyPage = true
        } else {
            if (current === 1) {
                isFirstPage = true
            }
            if (current === total) {
                isLastPage = true
            }
        }
        this.#elements.prevBtn.disabled = isOnlyPage || isFirstPage
        this.#elements.nextBtn.disabled = isOnlyPage || isLastPage
        this.#elements.maxPage.textContent = total
        this.#elements.input.value = current
        this.#elements.input.max   = total
        this.classList.toggle("hidden", isOnlyPage)
    }
}
customElements.define("paging-view", PagingView)
