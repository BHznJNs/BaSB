import el from "../utils/dom/el.js"

class FullscreenMask extends HTMLElement {
    constructor() {
        super()
    }
}
customElements.define("fullscreen-mask", FullscreenMask)

export default class FullscreenView extends HTMLElement {
    constructor() {
        super()

        const mask = new FullscreenMask()
        mask.addEventListener("click", () =>
            this.toggle(false))

        const container = el("div", "", {
            "class": "container"
        })

        this.classList.add("fullscreen")
        this.mask = mask
        this.container = container
        this.appendChild(mask)
        this.appendChild(container)
    }

    appendToContainer(el) {
        this.container.appendChild(el)
    }

    toggle(force) {
        this.mask.classList.toggle("show", force)
        this.container.classList.toggle("show", force)
        this.toggleCallback(force)
    }
    toggleCallback(force) {}
}
customElements.define("fullscreen-view", FullscreenView)
