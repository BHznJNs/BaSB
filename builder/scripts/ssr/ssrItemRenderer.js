import path from "node:path"
import ssrItemTemplate from "../../templates/ssrItem.js"
import renderer from "../../utils/markdown/index.js"

export function analyze(source) {
    const htmlNodes = renderer(source)
    htmlNodes.forEach(node => node.toHTML())
}

export function renderToHTML(articlePath, source) {
    const htmlNodes   = renderer(source)
    const title       = path.basename(articlePath, path.extname(articlePath))
    const htmlBody    = htmlNodes.map(node => node.toHTML()).join("")
    const htmlContent = ssrItemTemplate(title, htmlBody, articlePath)
    return htmlContent
}
