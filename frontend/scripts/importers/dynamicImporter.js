import UnOverridedError from "./UnOverridedError.js"
import languageSelector from "../../utils/languageSelector.js"

export default class DynamicImporter {
    static loadErrMsg   = languageSelector("加载失败", "load error")
    static renderErrMsg = languageSelector("渲染失败", "render error")

    name = ""
    _module = null
    _targetElList = null

    async importModule(props) { throw new UnOverridedError("importModule") }
    async beforeRender(props) {}
    loadCondition(props) { throw new UnOverridedError("loadCondition") }
    renderItem(el) { throw new UnOverridedError("renderItem") }

    renderAll(props) {
        for (const el of this._targetElList()) {
            try {
                this.renderItem(el)
            } catch(err) {
                this.renderErrResolver(err, el)
            }
        }
    }

    loadErrResolver(err) {
        console.error(err)
        this._targetElList().forEach(el =>
            el.textContent = this.name + " " + DynamicImporter.loadErrMsg)
    }
    renderErrResolver(err, el) {
        console.error(err)
        el.textContent = this.name + " " + DynamicImporter.renderErrMsg
    }

    async render(props) {
        if (!this.loadCondition(props)) {
            return
        }
        if (this._module === null) {
            try {
                this._module = await this.importModule(props)
            } catch(err) {
                this.loadErrResolver(err)
                return
            }
        }
        await this.beforeRender(props)
        this.renderAll(props)
    }
}
