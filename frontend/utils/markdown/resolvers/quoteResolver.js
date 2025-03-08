import mdResolver from "../index.js"
import { Quote } from "../node.js"

export default function(firstLine, lines) {
    let quotedContent = firstLine.slice(2) + "\n"

    while (lines.length) {
        const l = lines.shift()

        if (Quote.pattern(l)) {
            quotedContent += l.slice(2) + "\n"
        } else {
            lines.unshift(l)
            break
        }
    }
    const children = mdResolver(quotedContent)
    const node = new Quote(children)
    return node
}
