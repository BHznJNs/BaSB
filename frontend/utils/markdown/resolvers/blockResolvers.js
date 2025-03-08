import mdResolver from "../index.js"
import { ChartBlock, CodeBlock, DetailsBlock, FormulaBlock, Iframe, IframeBlock } from "../node.js"

export function blockResolverGenerator(endSign, targetClass) {
    return function(firstLine, lines) {
        const description = firstLine.slice(3)

        let content = ""
        while (lines.length) {
            const l = lines.shift()

            if (l === endSign) {
                break
            }

            content += l + "\n"
        }
        return new targetClass(content, description)
    }
}

export const codeResolver    = blockResolverGenerator("```", CodeBlock)
export const chartResolver   = blockResolverGenerator("!!!", ChartBlock)
export const formulaResolver = blockResolverGenerator("$$$", FormulaBlock)
export function detailsResolver(firstLine, lines) {
    const resolver = blockResolverGenerator(">>>", DetailsBlock)
    const node = resolver(firstLine, lines)
    node.content = mdResolver(node.content)
    return node
}
export function iframeResolver(firstLine, lines) {
    const resolver = blockResolverGenerator("@@@", IframeBlock)

    if (!firstLine.startsWith("@@@")) {
        // link to out resource
        return new Iframe(firstLine)
    }
    return resolver(firstLine, lines)
}
