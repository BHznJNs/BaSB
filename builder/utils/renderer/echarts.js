import { writeFileSync } from "node:fs"
import echarts from "echarts"

export default function echartsRenderer(chartContent, savePath) {
    let SVGContent, options

    try {
        options = new Function(
            "let option;"
            + chartContent
            + ";return option"
        )()
    } catch(_) {
        console.error("[Renderer Error] Invalid echarts options:\n" + chartContent)
    }

    try {
        let chart = echarts.init(null, null, {
            renderer: "svg",
            ssr: true,
            width: 600,
            height: 460,
        })
        chart.setOption(options)
        SVGContent = chart.renderToSVGString()
        chart.dispose()
        chart = null
    } catch(err) {
        console.error("[Renderer Error] " + err)
    }

    writeFileSync(savePath, SVGContent)
}
