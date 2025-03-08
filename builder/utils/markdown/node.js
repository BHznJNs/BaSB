import mdResolver from "./index.js"
import { render } from "../renderer/index.js"
import el from "../../../frontend/utils/dom/el.js"
import { countEntry } from "../../../frontend/utils/markdown/inline.js"
import countWord from "../../../common/countWord.js"
import languageSelector from "../../utils/languageSelector.js"
import getInterval from "../../../frontend/utils/markdown/utils/getInterval.js"
import {
    Headline,
    Para,
    Quote,
    Divider,
    List,
    Table,
    QABlock,
    Question,
    Answer,
} from "./node.js"

// count method patches
Headline.prototype.count = function() {
    return countEntry(this.content)
}
Para.prototype.count = function() {
    return countEntry(this.content)
}
Quote.prototype.count = function() {
    const result = this.children
        .reduce((accumulator, current) =>
            accumulator += current.count()
        , 0)
    return result
}
Divider.prototype.count = () => 0
List.prototype.count = function() {
    const result = this.children.reduce((accumulator, current) => {
        let temp
        if (typeof current === "string") {
            temp = accumulator + countEntry(current)
        } else {
            temp = accumulator + current.count()
        }
        return temp
    }, 0)
    return result
}
Table.prototype.count = function() {
    const countRow = row => row
        .reduce((accumulator, current) =>
            accumulator += countEntry(current)
        , 0)
    const headerCount = countRow(this.headerCells)
    const bodyCount   = this.bodyRows
        .reduce((accumulator, row) =>
            accumulator += countRow(row)
        , 0)
    return headerCount + bodyCount
}
QABlock.prototype.count = function() {
    return this.elements.reduce((accumulator, element) =>
        accumulator + element.count(), 0)
}
Question.prototype.count = function() {
    return countEntry(this.content)
}
Answer.prototype.count = function() {
    return countEntry(this.content)
}

export {
    Headline,
    EmptyLine,
    Para,
    Quote,
    Divider,
    List,
    Table,
    QABlock,
    Question,
    Answer,
} from "../../../frontend/utils/markdown/node.js"

// --- --- --- --- -
// media nodes start
// --- --- --- --- -

class MediaNode {
    source = ""
    description = ""    
    constructor(mdText) {
        mdText = mdText.substr(2)
        this.description = getInterval(mdText, "[", "]")
        mdText = mdText.substr(this.description.length + 2)
        this.source = getInterval(mdText, "(", ")")
    }

    count = () => 0

    static containerGenerator(content) {
        return el("div", content, {
            "class": "media-container"
        })
    }

    static patternGenerator(identifierSign) {
        return (source) =>
            source.startsWith(identifierSign + "[") && source.endsWith(")")
    }

    static replaceContentGenerator(href, description) {
        const downloadEl = el("a", languageSelector("从这里下载！", "Download Here!"), { href })
        const replaceContent = `${description}<br>${downloadEl}`
        return replaceContent
    }

    static srcUrlResolver(rawUrl) {
        try {
            new URL(rawUrl)
            if (rawUrl.startsWith("data")) {
                return rawUrl
            }
        } catch {}

        const path = globalThis.__ResourcePath__
        const actualUrl = new URL(rawUrl, path + "/").toString()
        return actualUrl
    }
}

export class Image extends MediaNode {
    static pattern = MediaNode.patternGenerator("!")

    toHTML() {
        const actualUrl = MediaNode.srcUrlResolver(this.source)
        const imageEl = el("img", {
            src: actualUrl,
            alt: this.description,
            loading: "lazy",
            tabindex: 0,
        })
        return MediaNode.containerGenerator(imageEl)
    }
}

export class Audio extends MediaNode {
    static pattern = MediaNode.patternGenerator(":")

    toHTML() {
        const actualUrl = MediaNode.srcUrlResolver(this.source)
        const replaceContent = MediaNode.replaceContentGenerator(actualUrl, this.description)
        const audioEl = el("audio", replaceContent, {
            src: actualUrl,
            controls: true,
        })
        return MediaNode.containerGenerator(audioEl)
    }
}

export class Video extends MediaNode {
    static pattern = MediaNode.patternGenerator("?")

    toHTML() {
        const actualUrl = MediaNode.srcUrlResolver(this.source)
        const replaceContent = MediaNode.replaceContentGenerator(actualUrl, this.description)
        const videoEl = el("video", replaceContent, {
            src: actualUrl,
            controls: "true",
        })
        return MediaNode.containerGenerator(videoEl)
    }
}

export const isIframePattern = (source) =>
    MediaNode.patternGenerator("@")(source)
    || source.startsWith("@@@")

export class Iframe extends MediaNode {
    toHTML() {
        const actualUrl = MediaNode.srcUrlResolver(this.source)
        const iframeEl = el("iframe", this.description, {
            src: actualUrl,
            title: this.description,
            sandbox: "allow-same-origin allow-scripts",
            loading: "lazy",
        })
        return MediaNode.containerGenerator(iframeEl)
    }
}

// --- --- --- ---
// media nodes end
// --- --- --- ---

// --- --- --- --- -
// block nodes start
// --- --- --- --- -

export class CodeBlock {
    constructor(content, lang) {
        this.lang = lang
        // in node.js
        this.content = content
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
    }

    count = () => countWord(this.content)
    toHTML() {
        const isPlaintext = ["plaintext", "text", ""].includes(this.lang)
        
        let langName, langClass
        if (isPlaintext) {
            langClass = "nohighlight"
            langName  = "PLAINTEXT"
        } else {
            langClass = `language-${this.lang}`
            langName  = this.lang.toUpperCase()
        }

        const codeEl = el("code", this.content, {
            "class": langClass,
            tabindex: 0
        })
        return el("pre", codeEl, {
            "class": "code-block",
            "data-language": langName
        })
    }

    static pattern = source => source.startsWith("```")
}

export class DetailsBlock {
    summary = ""
    content = ""

    constructor(content, summary) {   
        this.summary = summary
        this.content = mdResolver(content)
    }
    count() {
        const summaryCount = countEntry(this.summary)
        const contentCount = this.content.reduce((accumulator, current) =>
            accumulator += current.count()
        , 0)
        return summaryCount + contentCount
    }
    toHTML() {
        const summaryEl  = el("summary", this.summary)
        const innerNodes = this.content.map(node => node.toHTML())
        const detailsEl  = el("details", innerNodes.concat(summaryEl))
        return detailsEl
    }

    static pattern = source => source.startsWith(">>>")
}

export class FormulaBlock {
    content = ""
    description = ""

    constructor(content, description) {
        this.content = content
        this.description = description
    }

    count = () => countWord(this.content)
    toHTML() {
        const filename = render(this.content, "katex")
        const formulaImage = el("img", {
            src: "./" + filename,
            alt: this.description,
        })
        const container = el("div", formulaImage, {
            "class": "math"
        })
        return container
    }

    static pattern = source =>
        source.startsWith("$$$")
}

export class IframeBlock {
    constructor(content, description) {
        globalThis.__IframeCounter__ += 1
        this.id = "iframe_" + globalThis.__IframeCounter__
        this.description = description
        this.content = content
    }

    count = () => this.content.length
    toHTML() {
        const iframeEl = el("iframe", this.description, {
            id: this.id,
            title: this.description,
            srcdoc: this.content,
            sandbox: "allow-scripts",
        })
        return MediaNode.containerGenerator(iframeEl)
    }
}

export class ChartBlock {
    static pattern = source =>
        source.startsWith("!!!")

    #type = null

    constructor(content, type) {
        this.content = content
        switch (type) {
            case "": case "echarts":
                this.#type = "echarts"
                break
            case "flow":       case "flowchart":
            case "flow chart": case "flow-chart":
                this.#type = "flowchart"
                break
            case "sequence":      case "sequencechart":
            case "sequence char": case "sequence-chart":
                this.#type = "sequence"
                break
            case "gantt":       case "ganttchart":
            case "gantt chart": case "gantt-chart":
                this.#type = "gantt"
                break
            case "rail": case "railroad": case "railroadchart":
            case "railroad chart":        case "railroad-chart":
                this.#type = "railroad"
                break
            case "qrcode": case "qr-code": case "qr code":
                this.#type = "qrcode"
                break
            default:
                const errMsg = "Unknown chart type: " + type
                console.error(errMsg)
                this.#type = "Unknown"
        }
    }

    count = () => 0
    toHTML() {
        if (this.#type === "Unknown") {
            return ""
        }
        const chartImage = render(this.content, this.#type)
        const chartEl = el("img", {
            src: "./" + chartImage
        })
        const container = el("div", chartEl, {
            "class": "media-container"
        })
        return container
    }
}

// --- --- --- ---
// block nodes end
// --- --- --- ---
