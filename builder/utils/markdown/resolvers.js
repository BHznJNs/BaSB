import {
    Quote,
    FormulaBlock, ChartBlock,
    DetailsBlock, CodeBlock,
    IframeBlock, Iframe,
 } from "./node.js"
import mdResolver from "./index.js"
import { blockResolverGenerator } from "../../../src/utils/markdown/resolvers/index.js"
export {
    listResolver, tableResolver,
} from "../../../src/utils/markdown/resolvers/index.js"
export { default as QAResolver } from "../../../src/utils/markdown/resolvers/QAResolver.js"

export const chartResolver   = blockResolverGenerator("!!!", ChartBlock)
export const formulaResolver = blockResolverGenerator("$$$", FormulaBlock)

export const codeResolver    = blockResolverGenerator("```", CodeBlock)
export const detailsResolver = blockResolverGenerator(">>>", DetailsBlock)
export function iframeResolver(firstLine, lines) {
    const blockResolver = blockResolverGenerator("@@@", IframeBlock)

    if (!firstLine.startsWith("@@@")) {
        // link to out resource
        return new Iframe(firstLine)
    }
    return blockResolver(firstLine, lines)
}

export function quoteResolver(firstLine, lines) {
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

