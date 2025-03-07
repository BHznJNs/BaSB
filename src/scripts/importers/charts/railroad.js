import importStyle from "../style.js"
import ChartImporter from "./importer.js"
import { config } from "../../../utils/loadConfig.js"

let railroadRenderOptions = null
const { railroadOptions } = config
const ASCIIPattern = /[\x00-\x7F]/
const CJKPattern   = /['"]([^'"]*[/\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+[^'"]*)['"]/gu

class RailroadImporter extends ChartImporter {
    _targetElList = () => document.querySelectorAll(".railroad-container")

    renderItem(el, chartContent="") {
        const CHAR_WIDTH_before = railroadRenderOptions.CHAR_WIDTH
        const containsCJK = CJKPattern.test(chartContent)
        const isAllContainsASCII = (chartContent.match(CJKPattern) || [])
            .map(matchItem => matchItem.slice(1, -1))
            .every(item => ASCIIPattern.test(item))
        const targetCharWidth = containsCJK
            && (isAllContainsASCII ? 13 : 14)
            || railroadRenderOptions.CHAR_WIDTH
        if (railroadRenderOptions.CHAR_WIDTH < targetCharWidth) {
            railroadRenderOptions.CHAR_WIDTH = targetCharWidth
        }

        const renderArgs = this._module.concat(el)
        const renderFn = new Function(
            "Diagram",
            "ComplexDiagram",
            "Sequence",
            "Stack",
            "OptionalSequence",
            "AlternatingSequence",
            "Choice",
            "HorizontalChoice",
            "MultipleChoice",
            "Optional",
            "OneOrMore",
            "ZeroOrMore",
            "Group",
            "Start",
            "End",
            "Terminal",
            "NonTerminal",
            "Comment",
            "Skip",
            "Block",
            "targetElement",
            chartContent + ".addTo(targetElement)",
        )
        renderFn.apply(null, renderArgs)
        // restore CHAR_WIDTH
        railroadRenderOptions.CHAR_WIDTH = CHAR_WIDTH_before
    }

    async importModule() {
        importStyle("./dist/libs/railroad-diagrams/railroad.css")
        const module = await import("../../../libs/railroad-diagrams/railroad.min.js")
        const {
            default: rr,
            Options,
        } = module
        Object.assign(Options, {
            VS                : railroadOptions.verticalGap,
            AR                : railroadOptions.arcRadius,
            INTERNAL_ALIGNMENT: railroadOptions.internalAlignment,
            CHAR_WIDTH        : railroadOptions.charWidth,
            COMMENT_CHAR_WIDTH: railroadOptions.commentCharWidth,
        })
        railroadRenderOptions = Options
        return [
            rr.Diagram,
            rr.ComplexDiagram,
            rr.Sequence,
            rr.Stack,
            rr.OptionalSequence,
            rr.AlternatingSequence,
            rr.Choice,
            rr.HorizontalChoice,
            rr.MultipleChoice,
            rr.Optional,
            rr.OneOrMore,
            rr.ZeroOrMore,
            rr.Group,
            rr.Start,
            rr.End,
            rr.Terminal,
            rr.NonTerminal,
            rr.Comment,
            rr.Skip,
            rr.Block,
        ]
    }
}

const inst = new RailroadImporter()
export default inst.render.bind(inst)
