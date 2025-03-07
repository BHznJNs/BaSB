import ChartImporter from "./importer.js"
import importStyle from "../style.js"
import { config } from "../../../utils/loadConfig.js"

const { language, ganttOptions } = config

if (!("language" in ganttOptions)) {
    // set language of gantt charts as default
    ganttOptions.language = language
}

class GanttImporter extends ChartImporter {
    _targetElList = () => document.querySelectorAll(".ganttchart-container")

    renderItem(el, chartContent) {
        new this._module(el, chartContent, ganttOptions)
    }

    async importModule() {
        importStyle("./dist/libs/frappe-gantt/frappe-gantt.min.css")
        const module = await import("../../../libs/frappe-gantt/frappe-gantt.min.js")
        return module.default
    }
}

const inst = new GanttImporter()
export default inst.render.bind(inst)
