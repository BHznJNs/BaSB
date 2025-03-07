import path from "node:path"
import { config } from "../utils/loadConfig.js"
import renderer from "../../src/utils/markdown/index.js"
import languageSelector from "../utils/languageSelector.js"
import el from "../../src/utils/dom/el.js"

export const htmlLang = languageSelector("zh-CN", "en")

/**
 * 
 * @param {string} title
 * @param {string} description
 * @param {string} base
 * @returns 
 */
export function header(title, description, base="./") {
    return `\
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="viewport" content="width=device-width, initial-scale=1.0">\
${description ? `\n<meta name="description" content="${description}">` : ""}
<title>${title}</title>
<link rel="shortcut icon" href="${base}dist/imgs/favicon.png" type="image/x-icon">
<link rel="stylesheet" href="${base}dist/style.min.css">`
}

export function inlineDarkmodeSwitcherScript() {
    return `\
<script>
const darkModeMediaQuery = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
const darkModeSwitcher = () => {
    const isDarkMode = darkModeMediaQuery.matches
    document.body.classList.toggle("dark" ,  isDarkMode)
    document.body.classList.toggle("light", !isDarkMode)
}
if (darkModeMediaQuery) {
    darkModeMediaQuery.addListener(darkModeSwitcher)
    darkModeSwitcher()
}
</script>`
}

export function navigator(
    base="./",
    enableSearch=config.search.enable,
    enableRSS=config.rss.enable,
) {
    const homepageBtn = `\
<a
    id="homepage"
    class="icon-btn underline-side left"
    href="${base}"
    onclick="globalThis.__CurrentPage__=1"
>
    <img src="${base}dist/imgs/homepage.svg" alt="${languageSelector("主页", "home")}">
    <span class="underline-target">${languageSelector("主页", "Home")}</span>
</a>`
    const searchBtn = enableSearch ? `\
<button
    id="search-btn"
    class="icon-btn"
    title="${languageSelector("搜索", "Search")}"
>
    <img
        src="${base}dist/imgs/search.svg"
        alt="${languageSelector("搜索", "Search")}"
    >
</button>` : ""
    const rssBtn = enableRSS ? `\
<a
    id="rss-icon"
    class="icon-btn"
    href="${base}user/rss.xml"
    title="${languageSelector("RSS 订阅", "RSS Subscribe")}"
>
    <img
        src="${base}dist/imgs/rss.svg"
        alt="${languageSelector("RSS 订阅", "RSS Subscribe")}"
    >
</a>` : ""
    const themeTogglingBtn = `\
<span>
    <span
        id="light-btn"
        class="icon-btn"
        role="button"
        tabindex="0"
        title="${languageSelector("亮色模式", "Light Mode")}"
        onclick="document.body.classList.remove('dark'); document.body.classList.add('light')"
    >
        <img
            src="${base}dist/imgs/sun.svg"
            alt="${languageSelector("亮色模式图标", "Light Mode Icon")}"
        >
    </span>
    <span
        id="dark-btn"
        class="icon-btn"
        role="button"
        tabindex="0"
        title="${languageSelector("黑暗模式", "Dark Mode")}"
        onclick="document.body.classList.add('dark'); document.body.classList.remove('light')"
    >
        <img
            src="${base}dist/imgs/moon.svg"
            alt="${languageSelector("黑暗模式图标", "Dark Mode Icon")}"
        >
    </span>
</span>`
    return `\
<nav>
    ${homepageBtn}
    <span>${searchBtn}${rssBtn}${themeTogglingBtn}</span>
</nav>`
}

export function loadExtraScripts(base="./") {
    return `\
<script>window.addEventListener("load", () => {
    const scripts = ${JSON.stringify(
        config.extraScripts.map(item => {
            try {
                new URL(item)
                return item
            } catch {
                return path.posix.join(base, item)
            }
        })
    )}
    for (const script of scripts) {
        const scriptEl = document.createElement("script")
        scriptEl.src = script
        scriptEl.async = true
        document.head.appendChild(scriptEl)
    }
})</script>`
}

export function footer() {
    if (!config.footer) {
        return ""
    }

    const footerContent = renderer(config.footer)
        .map(node => node.toHTML())
        .join("")
    return el("footer", footerContent)
}
