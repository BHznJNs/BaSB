import importStyle from "./style.js"
import DynamicImporter from "./dynamicImporter.js"
import { config } from "../../utils/loadConfig.js"

const { katexOptions } = config

class KatexImporter extends DynamicImporter {
    name = "KaTeX"
    _targetElList = () => document.querySelectorAll(".math")

    loadCondition(isContainsFormula) {
        return isContainsFormula
    }

    renderErrResolver(err, el) {
        const texString = el.textContent
        if (err instanceof this._module.ParseError) {
            // KaTeX can't parse the expression
            el.innerHTML = ("Error in LaTeX '" + texString + "': " + err.message)
                .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        } else {
            // other error
            el.textContent = this.name + " " + DynamicImporter.renderErrMsg
            console.error(err)
        }
    }
    renderItem(el) {
        const texString = el.textContent
        this._module.render(texString, el, katexOptions)
    }

    async importModule() {
        importStyle("./dist/libs/katex/katex.min.css")
        const module = await import("../../libs/katex/katex.min.js")
        return module.default
    }
}

const inst = new KatexImporter()
export default inst.render.bind(inst)
