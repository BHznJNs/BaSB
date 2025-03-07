import {
    Headline, EmptyLine,
    Quote, Divider,
    List, Para, Table,
    Image, Audio, Video,
    FormulaBlock, CodeBlock,
    isIframePattern,
    DetailsBlock,
    ChartBlock,
    Question,
    Answer,
} from "./node.js"
import {
    listResolver, quoteResolver, tableResolver,
    codeResolver, formulaResolver, chartResolver,
    iframeResolver, detailsResolver,
    QAResolver,
} from "./resolvers/index.js"
import getLines from "./utils/getLines.js"

export default function mdResolver(source) {
    const lines = getLines(source)
    const nodes = []

    while (lines.length) {
        const l = lines.shift()

        if (!l.length) {
            // skip empty line
            continue
        }

        if (Headline.pattern(l)) {
            nodes.push(new Headline(l))
        } else
        if (EmptyLine.pattern(l)) {
            nodes.push(new EmptyLine)
        } else
        if (Divider.pattern(l)) {
            nodes.push(new Divider)
        } else
        if (Quote.pattern(l)) {
            nodes.push(quoteResolver(l, lines))
        } else
        if (List.isListPattern(l)) {
            nodes.push(listResolver(l, lines))
        } else
        if (Question.pattern(l) || Answer.pattern(l)) {
            nodes.push(QAResolver(l, lines))
        } else
        if (Table.pattern(l)) {
            nodes.push(tableResolver(l, lines))
        } else
        if (Image.pattern(l)) {
            nodes.push(new Image(l))
        } else
        if (Audio.pattern(l)) {
            nodes.push(new Audio(l))
        } else
        if (Video.pattern(l)) {
            nodes.push(new Video(l))
        } else
        if (DetailsBlock.pattern(l)) {
            nodes.push(detailsResolver(l, lines))
        } else
        if (FormulaBlock.pattern(l)) {
            nodes.push(formulaResolver(l, lines))
        } else
        if (CodeBlock.pattern(l)) {
            nodes.push(codeResolver(l, lines))
        } else
        if (ChartBlock.pattern(l)) {
            nodes.push(chartResolver(l, lines))
        } else
        if (isIframePattern(l)) {
            nodes.push(iframeResolver(l, lines))
        } else {
            nodes.push(new Para(l))
        }
    }
    return nodes
}