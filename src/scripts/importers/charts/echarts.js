import ChartImporter from "./importer.js"
import { config } from "../../../utils/loadConfig.js"
import debounce from "../../../utils/debounce.js"
import eventbus from "../../../utils/eventbus/inst.js"
import mergeObj from "../../../utils/mergeObj.js"

let [
    echarts,
    importChart,
    importComponent,
] = [null, null, null]
const globalOptions = config.echartsOptions

function chartOptionResolver(options={}, libsToImport) {
    const ignoredProps = [
        "width",
        "height",
        "color",
        "backgroundColor",
        "darkMode",
        "textStyle",
        "aria",
        "axisPointer",
        "animation",
        "animationThreshold",
        "animationDuration",
        "animationEasing",
        "animationDelay",
        "animationDurationUpdate",
        "animationEasingUpdate",
        "animationDelayUpdate",
        "stateAnimation",
        "blendMode",
        "hoverLayerThreshold",
        "options",
        "useUTC",
        "media",
    ]

    for (const key in options) {
        if (ignoredProps.includes(key)) {
            continue
        }
        if (key === "series") {
            const { series } = options
            if (!(series instanceof Array)) {
                libsToImport.charts.add(series.type)
                continue
            }
            for (const item of series) {
                if (!("type" in item)) {
                    continue
                }
                libsToImport.charts.add(item.type)
            }
            continue
        }

        switch (key) {
            case "xAxis":
            case "yAxis":
                libsToImport.components.add("grid")
                continue
            case "radiusAxis":
            case "angleAxis":
                libsToImport.components.add("polar")
                continue
            case "parallelAxis":
                libsToImport.components.add("parallel")
                continue
        }
        libsToImport.components.add(key)
    }
}

function specificChartResolver(options, isDarkMode) {
    let resultObj = options
    if (isDarkMode && "calendar" in options) {
        const calendarChartDarkModeOptions = {
            splitLine : { lineStyle: { color: "white" } },
            dayLabel  : { color: "#eee" },
            monthLabel: { color: "#eee" },
            itemStyle : {
                color : "none",
                borderWidth: 0.5,
            },
        }
        if (options.calendar instanceof Array) {
            options.calendar.forEach(obj =>
                mergeObj(obj, calendarChartDarkModeOptions))
        } else {
            mergeObj(options.calendar, calendarChartDarkModeOptions)
        }
    }
    return resultObj
}

async function importChartLibs(chartOptions) {
    const libsToImport = {
        charts: new Set(),
        components: new Set(),
    }
    chartOptionResolver(globalOptions, libsToImport)
    chartOptions.forEach(options =>
        chartOptionResolver(options, libsToImport))

    const chartsToImport = Array.from(libsToImport.charts).map(importChart)
    const componentsToImport = Array.from(libsToImport.components).map(importComponent)
    await Promise.all(chartsToImport.concat(componentsToImport))
        .then(echarts.use)
}

class EchartsImporter extends ChartImporter {
    _targetElList = () => document.querySelectorAll(".echarts-container")

    // event listeners
    #darkmodeObserver = new MutationObserver(_ => {
        for (const el of this._targetElList()) {
            // rerender all chart elements to reset color theme
            this._module.dispose(el)
            this.renderItem(el)
        }
    })
    #resizeEvent() {
        this._targetElList()
            .forEach(el =>
                echarts.getInstanceByDom(el).resize())
    }
    #sizeSetter(el, options) {
        if (options.width) {
            el.style.minWidth = "100%"
            el.style.width = options.width + "px"
            delete options.width
        }
        if (options.height) {
            el.style.height = options.height + "px"
            delete options.height
        }
    }

    // --- --- --- --- --- ---

    renderItem(el) {
        this.#sizeSetter(el, el.__ChartOptions__)

        const isDarkMode = document.body.classList.contains("dark")
        const renderMode = isDarkMode ? "another-dark" : "light"
        const chartInst  = this._module.init(el, renderMode)

        // options clone
        const globalOptionsCloned = structuredClone(globalOptions)
        const currentOptionsCloned = structuredClone(el.__ChartOptions__)
        // options merge
        const specificResolved = specificChartResolver(currentOptionsCloned, isDarkMode)
        const finalOptions = mergeObj(globalOptionsCloned, specificResolved)
        chartInst.setOption(finalOptions)
    }

    async beforeRender() {
        const chartOptions = Array.from(this._targetElList())
            .map(el => el.__ChartOptions__)
        try {
            await importChartLibs(chartOptions)
        } catch(err) {
            this.loadErrResolver(err)
        }
    }

    async importModule() {
        const [module, darkTheme] = await Promise.all([
            import("../../../libs/echarts/core.js"),
            import("./echartsAnotherDarkTheme.js"),
        ])
        echarts         = module.default
        importChart     = module.importChart
        importComponent = module.importComponent
        echarts.registerTheme("another-dark", darkTheme.default)

        // dark mode toggling listener
        const body = document.body
        this.#darkmodeObserver.observe(body, {
            attributes: true,
            attributeFilter: ["class"]
        })

        // resize event listeners
        eventbus.on("catalog-toggle", () => {
            setTimeout(this.#resizeEvent.bind(this), 1000)
        })
        window.addEventListener("resize",
            debounce(this.#resizeEvent.bind(this), 200))
        return echarts
    }
}

const inst = new EchartsImporter()
export default inst.render.bind(inst)
