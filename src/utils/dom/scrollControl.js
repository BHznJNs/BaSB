import debounce from "../debounce.js"

export const currentScrollTop = () =>
    window.scrollY || document.documentElement.scrollTop
export const maxScrollTop = () =>
    document.documentElement.scrollHeight - document.documentElement.clientHeight

/**
 * @description scroll to specific position
 * @param {number} pos 
 */
export function scrollToPos(pos) {
    window.scroll({
        top: pos,
        behavior: "smooth",
    })
}

/**
 * @description scroll to the position of specific element
 * @param {Element} el 
 * @param {number} offset 
 */
export function scrollToEl(el, offset) {
    const scrollTargetPos = el.offsetTop
    const scrollOffset = -offset
    scrollToPos(scrollTargetPos + scrollOffset)
}

/** @description scroll to the document top */
export function scrollToTop() {
    scrollToPos(0)
}

/**
 * @param {Function} scrollController 
 * @param {() => boolean} predicate 
 */
export function ensureScrollTo(scrollController, predicate) {
    function scrollEnd() {
        const isAtPageBottom = Math.abs(maxScrollTop() - currentScrollTop()) < 10
        if (isAtPageBottom || predicate()) {
            window.removeEventListener("scroll", debounced)
        } else {
            scrollController()
        }
    }
    const debounced = debounce(scrollEnd, 30)
    window.addEventListener("scroll", debounced)
    scrollController()
}
