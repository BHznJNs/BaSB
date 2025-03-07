import ChartImporter from "./importer.js"

class SequenceImport extends ChartImporter {
    _targetElList = () => document.querySelectorAll(".sequencechart-container")

    constructor() { super() }

    renderItem(el, chartContent) {
        const diagram = new this._module(chartContent)
        el.appendChild(diagram.dom())
    }

    async importModule() {
        const module = await import("../../../libs/sequence-diagram/sequence-diagram-web.mjs")
        return module.SequenceDiagram
    }
}

const inst = new SequenceImport()
export default inst.render.bind(inst)
