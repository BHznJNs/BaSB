import "../styles/components/searchBox.css"
import FullscreenView from "./fullscreen.js"
import importStyle from "../scripts/importers/style"
import pathManager from "../scripts/pathManager.js"
import flexsearch from "../libs/flexsearch/flexsearch.bundle.module.min.js"
import languageSelector from "../utils/languageSelector.js"
import eventbus from "../utils/eventbus/inst.js"
import el from "../utils/dom/el.js"
import { tokenize } from "../utils/countWord.js"
import throttle from "../utils/throttle.js"

function indexFactory(indexData) {
    const index = new flexsearch.Index({
        preset: "memory",
        optimize: true,
        encode: tokenize,
    })

    if (indexData !== undefined) {
        for (const [key, data] of Object.entries(indexData)) {
            index.import(key, data)
        }
    }
    return index
}

class PageController {
    pageList = []
    maximum = 0
    current = 0

    #search(id, query) {
        const {index, idMap} = this.pageList[id]
        const searchResult = index.search(query)
        return searchResult.map(itemIndex => idMap[itemIndex])
    }

    async #importer(id) {
        const file = await fetch(`./.index/search-index_${id}.json`)
        const json = await file.json()
        const { idMap, maxId, ...indexData } = json

        this.maximum = maxId
        this.pageList.push({
            idMap,
            index: indexFactory(indexData)
        })
    }

    get hasMorePage() {
        return this.current < this.maximum
    }

    async search(query) {
        const id = this.current

        if (this.pageList[id] === undefined) {
            // is not imported page, import it
            await this.#importer(id)
        }
        return this.#search(id, query)
    }

    async searchNext(query) {
        this.current += 1
        return await this.search(query)
    }
}

class SearchBox extends FullscreenView {
    pageController = new PageController
    resultCount = 0

    constructor() {
        super()

        importStyle("./dist/chunks/searchBox.min.css")

        this.input = el("input", "", {
            type: "text",
            placeholder: languageSelector("搜索", "Search"),
        })
        this.searchBtn = el("button", el("img", "", {
            src: "./dist/imgs/search.svg"
        }), {
            "class": "icon-btn search-btn",
            title: languageSelector("搜索图标", "Search Icon")
        })

        const inputGroup = el("div", [this.input, this.searchBtn], {
            "class": "input-group"
        })
        const noResultText = el("p", languageSelector("无结果", "No search result"), {
            "class": "no-result"
        })

        this.loadMoreBtn = el(
            "button",
            languageSelector("加载更多", "Load More"), {
            "class": "icon-btn loadmore-btn"
        })
        this.resultList = el("ul", "")
        this.resultContainer = el("div", [
            this.resultList,
            noResultText,
            this.loadMoreBtn,
        ], {
            "class": "result-container"
        })

        this.appendToContainer(inputGroup)
        this.appendToContainer(this.resultContainer)
        this.#appendEvents()
        this.toggleCallback(false)
    }

    toggleCallback(force) {
        const focusableElements = [
            this.input,
            this.searchBtn,
            this.loadMoreBtn,
            ...this.resultList.children,
        ]
        const tabIndex = force ? 0 : -1
        for (const el of focusableElements) {
            el.tabIndex = tabIndex
        }
    }

    clear() {
        this.resultCount = 0
        this.pageController.current = 0
        this.resultList.innerHTML = ""
        this.resultContainer.classList.remove("show")
    }

    #showSearchResults(searchResult) {
        const itemElFactory = content =>
            el("li", el("span", content, {
                "class": "underline-target"
            }), {
                "class": "underline-through",
                tabindex: 0,
            })

        const frac = document.createDocumentFragment()
        this.resultCount += searchResult.length
        searchResult
            .map(itemElFactory)
            .forEach(el => frac.appendChild(el))
        this.resultList.appendChild(frac)
        this.resultContainer.classList.add("show")

        this.loadMoreBtn.disabled = false
        this.loadMoreBtn.classList.toggle("show", this.pageController.hasMorePage)

        if (this.resultCount < 10 && this.pageController.hasMorePage) {
            setTimeout(() => this.#loadMore(), 100)
        }
    }

    #loadMore() {
        const searchText = this.input.value
        this.loadMoreBtn.disabled = true
        this.pageController.searchNext(searchText)
            .then(this.#showSearchResults.bind(this))
    }

    #appendEvents() {
        // when open, focus on the input
        eventbus.on("searchbox-show", () => {
            this.toggle(true)
            this.container.addEventListener(
                "transitionend",
                () => this.input.focus(),
                { once: true },
            )
        })

        // open article
        this.resultList.addEventListener("click", e => {
            const target = e.target
            if (target === this.resultList) {
                return
            }
            const targetArticle = "static/" + target.textContent
            pathManager.jumpTo(targetArticle)
            this.toggle(false)
        })

        // clear search result when `input`is empty
        this.input.addEventListener("input", this.clear.bind(this))

        // `Enter` key or click the search button to start search
        const searchThrottled = throttle(() => {
            this.clear()
            const searchText = this.input.value
            this.pageController.search(searchText)
                .then(this.#showSearchResults.bind(this))
        }, 500)
        this.searchBtn.addEventListener("click", searchThrottled)
        this.input.addEventListener("keydown", e => {
            if (e.key !== "Enter") {
                return
            }
            searchThrottled()
        })

        // load more button click event
        this.loadMoreBtn.addEventListener("click", this.#loadMore.bind(this))
    }
}
customElements.define("search-box", SearchBox)
