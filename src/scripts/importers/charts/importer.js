import DynamicImporter from "../dynamicImporter.js"
import UnOverridedError from "../UnOverridedError.js"
import languageSelector from "../../../utils/languageSelector.js"

export default class ChartImporter extends DynamicImporter {
    static loadErrMsg   = languageSelector("图表加载失败", "Chart load error")
    static renderErrMsg = languageSelector("图表渲染失败", "Chart render error")

    name = undefined

    loadCondition() { return true }

    loadErrResolver(err) {
        console.error(err)
        this._targetElList().forEach(el =>
            el.textContent = ChartImporter.loadErrMsg)
    }
    renderErrResolver(err, el) {
        console.error(err)
        el.textContent = ChartImporter.renderErrMsg
    }

    renderItem(el, chartContent) { throw new UnOverridedError("renderItem") }
    renderAll() {
        for (const el of this._targetElList()) {
            const chartContent = el.__ChartContent__
            try {
                this.renderItem(el, chartContent)
            } catch(err) {
                this.renderErrResolver(err, el)
            }
        }
    }
}
