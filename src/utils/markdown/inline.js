import el from "../dom/el.js"
import countWord from "../countWord.js"
import getInterval from "./utils/getInterval.js"
import resolvePathname from "../../libs/resolve-pathname/index.js"

// identifier character to HTML tag
const KeyToken_TagName_map = new Map([
    ["#", "strong"],
    ["`", "code"],
    ["_", "u"],
    ["/", "i"],
    ["-", "del"],
    [":", "span.dim"],
    [",", "sub"],
    ["'", "sup"],
    ["$", "span.math"],
])

const PairedParenMap = new Map([
    ["[", "]"],
    ["{", "}"],
    ["<", ">"],
])

// --- --- --- --- --- ---

let katexRenderer = null
if (typeof window === "undefined") {
    const renderModule = await import("../../../builder/utils/renderer/index.js")
    katexRenderer = content => renderModule.render(content, "katex")
}

class TextToken {
    constructor(content) {
        this.content = content
    }
    count  = () => countWord(this.content)
    toHTML = () => el("text", this.content)
}
class KeyToken {
    constructor(tagSign, content) {
        const tag = KeyToken_TagName_map.get(tagSign)
        if (tag.includes(".")) {
            const [realTagName, className] = tag.split(".")
            this.tagName = realTagName
            this.className = className
        } else {
            this.tagName = tag
        }
        this.content = content

        if (this.className === "math" && typeof window === "object") {
            // set this global variable to import
            // the math formula renderer module
            globalThis.__ContainsFormula__ = true
        }
    }

    count = () => countEntry(this.content)
    toHTML() {
        if (this.className === "math" && typeof window === "undefined") {
            // for katex rendering in node.js
            const filename = katexRenderer(this.content)
            const formulaImage = el("img", "", {
                src: "./" + filename
            })
            const container = el("span", formulaImage, {
                "class": "math"
            })
            return container
        }
        const elOption = this.className === undefined ? null : {"class": this.className}
        const thisEl = el(this.tagName, parseEntry(this.content), elOption)
        return thisEl
    }
}

class LinkToken {
    constructor(content, address) {
        this.content = content
        this.address = address
    }

    count = () => 0
    toHTML() {
        const displayContent = parseEntry(this.content)
        try {
            new URL(this.address)
            return el("a", displayContent, {
                href: this.address,
                target: "_blank"
            })
        } catch { /* if not a full URL */ }

        /* from here: https://stackoverflow.com/a/201378/28207463 */
        const emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        if (emailPattern.test(this.address)) {
            return el("a", displayContent, {
                href: "mailto:" + this.address,
                target: "_blank"
            })
        }

        if (this.address.startsWith("//")) {
            // relative link for some extra HTML files
            return el("a", displayContent, {
                href: this.address.slice(2),
            })
        } else if (this.address.startsWith("/")) {
            // static resources or links relative to `static` directory
            const actualAddress = "static" + this.address
            return el("a", displayContent, {
                href: "#" + actualAddress
            })
        }

        let base
        if ("location" in globalThis) {
            base = location.hash
        } else {
            base = globalThis.__ResourcePath__
        }
        const actualAddress = resolvePathname(this.address, base)
        return el("a", displayContent, {
            href: actualAddress
        })
    }
}
class PhoneticToken {
    constructor(content, notation) {
        this.content  = content
        this.notation = notation
    }

    count = () => countEntry(this.content)
    toHTML() {
        const ignoredLeftParenthesis = el("rp", "(")
        const ignoredRightParenthesis = el("rp", ")")
        const notationEl = el("rt", this.notation)

        const content = parseEntry(this.content).concat([
            ignoredLeftParenthesis,
            notationEl,
            ignoredRightParenthesis,
        ])
        return el("ruby", content, {
            "data-notation": this.notation
        })
    }
}
class DetailToken {
    constructor(content, detail) {
        this.content = content
        this.detail  = detail
    }

    count = () =>
        countEntry(this.content) +
        countEntry(this.detail)
    toHTML() {
        const detailEl = el("div", parseEntry(this.detail), {
            "class": "detail-content",
        })
        return el("span", [this.content, detailEl], {
            "class": "detail",
            "data-collapse": true,
            onclick(e) {
                e.stopPropagation()
                e.target.toggleAttribute("data-collapse")
            }
        })
    }
}

// --- --- --- --- --- ---

function parser(source) {
    function getFirstChar() {
        const ch = source.charAt(0)
        source = source.substring(1)
        return ch
    }
    function getSpecialTokenClass(tokenSign) {
        let targetTokenType
        if (tokenSign === "[") {
            targetTokenType = LinkToken
        } else if (tokenSign === "{") {
            targetTokenType = PhoneticToken
        } else if (tokenSign === "<") {
            targetTokenType = DetailToken
        } else { /* unreachable */ }
        return targetTokenType
    }

    // --- --- --- --- --- ---

    const tokens = []
    let textTerm = "" // text
    let keyTerm  = "" // inline style content
    let keyStart = ""
    let isEscape = false
    let isInKey  = false

    while (source.length) {
        const ch = getFirstChar()

        // key rules resolve
        if (KeyToken_TagName_map.has(ch)) {
            if (isEscape) {
                if (isInKey) {
                    keyTerm += "\\" + ch
                } else {
                    textTerm += ch
                }
                isEscape = false
                continue
            }

            if (isInKey && ch != keyStart) {
                keyTerm += ch
                continue
            }

            const nextCh = getFirstChar()
            if (nextCh != ch) {
                if (isInKey) {
                    keyTerm += ch
                } else {
                    textTerm += ch
                }
                source = nextCh + source
                continue
            }

            if (isInKey) {
                tokens.push(new KeyToken(ch, keyTerm))
                keyTerm  = ""
                keyStart = ""
            } else {
                tokens.push(new TextToken(textTerm))
                textTerm = ""
                keyStart = ch
            }
            isInKey = !isInKey
            continue
        }

        // special inline rules resolve
        if (["[", "{", "<"].includes(ch) && !isInKey && !isEscape) {
            const specialTokenSign = ch
            const pairedTokenSign = PairedParenMap.get(specialTokenSign)

            tokens.push(new TextToken(textTerm))
            textTerm = ""

            let removedContent = specialTokenSign
            // the actual displayed content for special inline elements
            const displayContent = getInterval(source, specialTokenSign, pairedTokenSign, true)
            if (displayContent != null) {
                removedContent += source.slice(0, displayContent.length + 1)
                source = source.substr(displayContent.length + 1)

                const nextCh = getFirstChar()
                removedContent += nextCh
                if (nextCh === "(") {
                    // the hidden displayed content for special inline elements
                    const hiddenContent = getInterval(source, "(", ")")
                    if (hiddenContent != null) {
                        let targetTokenType = getSpecialTokenClass(specialTokenSign)
                        source = source.substr(hiddenContent.length + 1)
                        tokens.push(new targetTokenType(displayContent, hiddenContent))
                        continue
                    }
                }
            }
            textTerm += removedContent
            continue
        }

        // --- --- --- --- --- ---

        if (ch === "\\") {
            isEscape = !isEscape
            continue
        }

        let text
        if (isEscape) {
            text = "\\" + ch
            isEscape = false
        } else {
            text = ch
        }

        if (isInKey) {
            keyTerm += text
        } else {
            textTerm += text
        }
    }

    if (keyTerm.length) {
        tokens.push(new KeyToken(keyStart, keyTerm))
    }
    if (textTerm.length) {
        tokens.push(new TextToken(textTerm))
    }
    return tokens
}

// --- --- --- --- --- ---

export function countEntry(source) {
    const tokens = parser(source)
    const result = tokens.reduce((accumulator, current) =>
        accumulator += current.count()
    , 0)
    return result
}

export function getRawContent(source) {
    const tokens = parser(source)
    const resultContent = []

    for (const token of tokens) {
        if (token instanceof KeyToken && token.className === "math") {
            continue
        }
        if (token instanceof LinkToken) {
            continue
        }
        resultContent.push(token.content)
    }

    return resultContent.join("")
}

export function parseEntry(source) {
    const htmlEntityReplace = source => source
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")

    const tokens = parser(source)
    const resultHTML = tokens
        .filter(token =>
            // remove empty TextToken
            !(token instanceof TextToken && !token.content.length))
        .map(token => token.toHTML())
    if (typeof window !== "object" && source === resultHTML[0]) {
        // for server rendering
        return htmlEntityReplace(source)
    }
    return resultHTML
}

// test cases
// console.log(parser("``\\```"))
// console.log(parseEntry("##bo//itelic//ld##"))
// console.log(parseEntry("##bo[link text](http://www.com)ld##"))
// console.log(parseEntry("::dim[link text](http://www.com)med::"))
// console.log(parseEntry("[http:\\/\\/www.com](http://www.com)"))
// console.log(parseEntry("//ita[link text](http:\\/\\/www.com)lic//"))
// console.log(parseEntry("``<test>``"))
// console.log(parseEntry("asd[asd"))
// console.log(parseEntry("asd[asd]asd"))
// console.log(parseEntry("asd[asd](asd"))
// console.log(parseEntry("asd[asd](asd)"))
// console.log(parseEntry("asd[##link##](asd)"))
// console.log(parseEntry("##asd[link##](asd)"))
// console.log(parseEntry("##asd[link](asd)##"))
// console.log(parseEntry("::dimmed::"))
// console.log(parseEntry("$$f_c = \\frac{1}{abc}$$"))
