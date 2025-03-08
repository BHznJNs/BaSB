import DynamicImporter from "./dynamicImporter.js"
import importStyle from "./style.js"

class HighlightImporter extends DynamicImporter {
    name = "Highlight.js"
    _targetElList = () => document.querySelectorAll("pre.code-block code")

    async #importLangDefs(languageList=[]) {
        const langDefImporters = languageList
            .filter(name => !this._module.getLanguage(name))
            .map(lang => import(`../../libs/highlight-es/languages/${lang.toLowerCase()}.js`))
        await Promise.all(langDefImporters)
            .then(langDefs => langDefs.forEach((defModule, index) => {
                const name = languageList[index]
                const def  = defModule.default
                this._module.registerLanguage(name, def)
            }))
            .catch(this.loadErrResolver)
    }

    loadCondition(languageList) {
        return languageList.size > 0
    }

    renderItem(el) {
        this._module.highlightElement(el)
    }
    async beforeRender(languageList=new Set()) {
        await this.#importLangDefs(Array.from(languageList))
    }
    async importModule() {
        importStyle("./dist/libs/highlight-es/github-dark.css")
        const module = await import("../../libs/highlight-es/highlight.min.js")
        return module.default
    }
}

const inst = new HighlightImporter()
export default inst.render.bind(inst)
