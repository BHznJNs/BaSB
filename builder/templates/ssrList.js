import {
    htmlLang, header, navigator, footer,
    inlineDarkmodeSwitcherScript,
} from "./snippets.js"
import { config } from "../utils/loadConfig.js"
import { File } from "../utils/directory.js"
import el from "../../src/utils/dom/el.js"
import dateFormatter from "../../src/utils/dateFormatter.js"
import languageSelector from "../utils/languageSelector.js"

function timeAgo(timestamp) {
    const cnIntervalUnits = {
        year: "年",
        month: "月",
        week: "周",
        day: "天",
        hour: "小时",
        minute: "分钟",
    }
    const intervals = {
        year: 31536000,
        month: 2628000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    }
    const difference = Math.floor((Date.now() - timestamp) / 1000)

    for (let unit in intervals) {
        const interval = intervals[unit]
        if (difference >= interval) {
            const count = Math.floor(difference / interval)
            const resultText = [
                languageSelector("约", "About"),
                count,
                (count === 1)
                    ? languageSelector(cnIntervalUnits[unit] + "前", unit + " ago")
                    : languageSelector(cnIntervalUnits[unit] + "前", unit + "s ago"),
            ].join(" ")
            return resultText
        }
    }
    return languageSelector("刚刚", "Just now")
}

function template(links) {
    return `\
<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
${header(config.title ?? "MarkdownBlog", config.description, "../")}
${config.extraMetadata
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
