import {
    htmlLang, header, navigator, footer,
    inlineDarkmodeSwitcherScript,
} from "./snippets.js"
import { config } from "../utils/loadConfig.js"
import { File } from "../utils/directory.js"
import languageSelector from "../utils/languageSelector.js"
import el from "../../frontend/utils/dom/el.js"
import dateFormatter from "../../frontend/utils/dateFormatter.js"

function template(links) {
    return `\
<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
${header(config.title ?? "MarkdownBlog", config.description, "../")}
${(config.extraMetadata ?? [])
    .map(item => el("meta", item))
    .join("")
}
<link rel="stylesheet" href="../dist/ssr-list.min.css">
</head>
<body>
<noscript>
<link rel="stylesheet" href="../dist/noscript.min.css">
</noscript>
${inlineDarkmodeSwitcherScript()}
${config.search.enable ? el("search-box"): ""}
${config.fab.enable    ? el("fab-icon")  : ""}
${navigator("../", false, true)}
<main>
<h1>${languageSelector("最新 2500 篇博文", "Latest 2500 Articles")}</h1>
<ul id="latest-list">
    ${links}
</ul>
</main>
${footer()}
</body>
</html>`
}

/**
 * @param {File[]} articles
 * @returns {string}
 */
export default function(articles) {
    const links = articles
        .slice(0, 2500)
        .map(file => {
            const linkEl = el("a", file.name, {
                href: config.homepage + file.ssrPath
            })
            const publishTime = el("code", dateFormatter(file.createTime))
            const dateEl = el("p", languageSelector(
                "发布于 " + publishTime,
                "Published on " + publishTime,
            ))
            return el("li", [linkEl, dateEl]) })
        .join("")
    const fileContent = template(links)
    return fileContent
}
