import "../styles/components/fab.css"
import pathManager from "../scripts/pathManager.js"
import importStyle from "../scripts/importers/style.js"
import { config } from "../utils/loadConfig.js"
import el from "../utils/dom/el.js"
import { scrollToTop } from "../utils/dom/scrollControl.js"
import languageSelector from "../utils/languageSelector.js"
import { downsizeText, enlargeText } from "../scripts/textScaler.js"
import eventbus from "../utils/eventbus/inst.js"

const fabItem = (imgName, title) => el("button",
    el("img", "", {
        src: `./dist/imgs/fab-${imgName}.svg`,
        loading: "lazy",
        onerror() {
            this.src = "./dist/imgs/broken-image.svg"
        }
    }),
    { title }
)

class FabIcon extends HTMLElement {
    #switcher = null
    #subItems = {}

    constructor() {
        super()

        // hide self before style loaded
        this.style.opacity = 0
        importStyle("./dist/chunks/fab.min.css")
            .then(() => this.style.opacity = 1)

        // --- --- --- --- --- ---

        const switcher = this.#switcher = fabItem("switch"        , languageSelector("切换浮动操作按钮", "Switch The FAB"))
        this.#subItems.backToParent     = fabItem("back-to-parent", languageSelector("返回父级"       , "Back to Parent"))
        this.#subItems.backToTop        = fabItem("back-to-top"   , languageSelector("返回顶部"       , "Back to Top"   ))
        this.#subItems.enlargeText      = fabItem("zoom-in"       , languageSelector("放大文本"       , "Enlarge Text"  ))
        this.#subItems.downsizeText     = fabItem("zoom-out"      , languageSelector("缩小文本"       , "Downsize Text" ))
        if (config.catalog.enable) {
            this.#subItems.catalogSwitcher =
                fabItem("catalog", languageSelector("开启/关闭菜单" , "Open/Close Catalog"))
        }

        const subFabItem = config.fab.buttons
            .map(fabItem => this.#subItems[fabItem])
            .filter(fabItem => fabItem !== undefined)
        for (const [index, item] of Object.entries(subFabItem)) {
            item.style.setProperty("--fab-item-index", Number(index) + 1)
        }

        switcher.id = "switcher"
        this.classList.add("hidden")
        this.classList.add("unseen")
        this.#appendEvent()
        this.style.setProperty("--fab-item-count", subFabItem.length + 1)

        const fragment = document.createDocumentFragment()
        for (const el of [switcher].concat(subFabItem)) {
            fragment.appendChild(el)
        }
        this.appendChild(fragment)
        this.toggleCallback()
    }

    toggleCallback() {
        const force = !this.classList.contains("hidden")
        const tabIndex = force ? 0 : -1
        for (const btn of Object.values(this.#subItems)) {
            btn.tabIndex = tabIndex
        }
    }

    #appendEvent() {
        this.#switcher.addEventListener("click", () => {
            this.classList.remove("unseen")
            this.classList.toggle("hidden")
            this.toggleCallback()
        })
        this.#subItems.backToParent.addEventListener("click", () => {
            pathManager.jumpTo(pathManager.parent())
        })
        this.#subItems.backToTop.addEventListener("click", scrollToTop)
        this.#subItems.enlargeText.addEventListener("click", enlargeText)
        this.#subItems.downsizeText.addEventListener("click", downsizeText)
        this.#subItems.catalogSwitcher.addEventListener("click", () => {
            eventbus.emit("catalog-toggle")
        })

        const toggleCatalogSwitcherState = () => {
            const catalogSwitcher = this.#subItems.catalogSwitcher
            const isInArticle = pathManager.isIn.article()
            catalogSwitcher.disabled = !isInArticle
        }
        window.addEventListener("hashchange", toggleCatalogSwitcherState)
        toggleCatalogSwitcherState()
    }
}
customElements.define("fab-icon", FabIcon)
