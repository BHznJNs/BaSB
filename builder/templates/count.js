import {
    header, navigator, footer, htmlLang,
    inlineDarkmodeSwitcherScript,
} from "./snippets.js"
import { config } from "../utils/loadConfig.js"
import { formatEchartsDate, insertDataIntoMap } from "../scripts/count/utils.js"
import languageSelector from "../utils/languageSelector.js"
/** @import {ArticleMetadata} from "../../types/ArticleMetadata.d.ts"  */

const now = Date.now()
const oneYear = 365 * 24 * 60 * 60 * 1000
function isWithinLastYear(timestamp) {
    return now - oneYear <= timestamp
}

function classifyDataByDay(metadataList) {
    const resultMap = new Map()
    for (const {date, count} of metadataList) {
        if (!isWithinLastYear(date)) {
            continue;
        }
        insertDataIntoMap(resultMap, [formatEchartsDate(date), count])
    }
    return Array.from(resultMap.entries())
}

function classifyDataByMonth(metadataList) {
    /** @type {(d: Date) => string} */
    const yearMonthFormater = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    const now = new Date()
    /** @type {Map<string, number>} */
    const monthCountMap = new Map(Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        return [yearMonthFormater(d), 0]
    }))
    for (const data of metadataList) {
        const d = new Date(data.date)
        const key = yearMonthFormater(d)
        const currentCount = monthCountMap.get(key)
        if (currentCount === undefined) continue
        monthCountMap.set(key, currentCount + data.count)
    }
    return {
        months: Array.from(monthCountMap.keys()).reverse(),
        count: Array.from(monthCountMap.values()).reverse(),
    }
}

function classifyDataByYear(metadataList) {
    const yearsMap = new Map()
    for (const { date, count } of metadataList) {
        const year = new Date(date).getFullYear()
        insertDataIntoMap(yearsMap, [year, count])
    }
    return {
        years: Array.from(yearsMap.keys()).reverse(),
        data: Array.from(yearsMap.values()).reverse(),
    }
}

function classifyDataByCatalog(metadataList) {
    const historyCatalogMap = new Map()
    const annualCatalogMap = new Map()
    for (const { date, catalog, count } of metadataList) {
        const kvPair = [catalog, count]
        insertDataIntoMap(historyCatalogMap, kvPair)
        if (isWithinLastYear(date)) {
            insertDataIntoMap(annualCatalogMap, kvPair)
        }
    }

    const historyData = []
    const annualData = []
    for (const [key, value] of historyCatalogMap) {
        historyData.push({ name: key, value })
    }
    for (const [key, value] of annualCatalogMap) {
        annualData.push({ name: key, value })
    }
    return { historyData, annualData }
}

function injectedScriptGenerator(lastYearData, multiMonthData, multiYearData, multiCatalogData) {
    const startDate = formatEchartsDate(now - oneYear)
    const endDate = formatEchartsDate(now)
    const paddingWidth = 4

    const lastYearOption = {
        width: 1280,
        height: 280,
        title: {
            top: 20,
            left: "center",
            text: languageSelector("年度字数统计", "Word Count in the Last Year"),
        },
        visualMap: {
            show: false,
            type: "piecewise",
            pieces: [
                { min: 0, max: 300 },
                { min: 300, max: 600 },
                { min: 600, max: 1500 },
                { min: 1500, max: 3000 },
                { min: 3000, max: 6000 },
                { min: 6000 },
            ]
        },
        calendar: {
            top: 80,
            left: 36,
            right: 30,
            cellSize: 24,
            range: [startDate, endDate],
            yearLabel: { show: false }
        },
        series: {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: lastYearData,
        }
    }
    const pastMonthsOption = {
        title: {
            top: 30,
            left: "center",
            text: languageSelector("过去 12 个月字数统计", "Word Counts for the Last 12 Months")
        },
        xAxis: {
            type: "category",
            data: multiMonthData.months,
        },
        yAxis: { type: "value" },
        grid: {
            top: 80,
            left: 75,
        },
        dataZoom: {
            type: "slider",
            startValue: 6,
            endValue: 11,
            zoomLock: true,
        },
        series: {
            data: multiMonthData.count,
            type: "bar",
        },
    };
    const pastYearsOption = {
        title: {
            top: 30,
            left: "center",
            text: languageSelector("历年字数统计", "Word Counts for the Past Years")
        },
        xAxis: {
            type: "category",
            data: multiYearData.years,
        },
        yAxis: { type: "value" },
        grid: {
            top: 80,
            left: 75,
        },
        dataZoom: {
            type: "slider",
            startValue: 0,
            endValue: 5,
            zoomLock: true,
        },
        series: {
            data: multiYearData.data,
            type: "bar",
        },
    }
    const catalogsOption = {
        title: [
            {
                text: languageSelector("各分类年度字数统计", "Word Counts of Catalogs\nfor the Last Year"),
                left: "2%",
                top: "10%",
                textAlign: "left",
            },
            {
                text: languageSelector("各分类历年字数统计", "Word Counts of Catalogs\nfor the Past Years"),
                left: "96%",
                bottom: "10%",
                textAlign: "right",
            },
        ],
        series: [
            {
                type: "pie",
                left: "42%",
                right: paddingWidth,
                top: paddingWidth,
                bottom: "40%",
                data: multiCatalogData.annualData,
            },
            {
                type: "pie",
                left: paddingWidth,
                right: "42%",
                top: "40%",
                bottom: paddingWidth,
                data: multiCatalogData.historyData,
            }
        ],
    }

    const injectedScript = `\
<script type="module">
import echartsImporter from "../dist/echarts.min.js"

document.querySelector("#last-year").__ChartOptions__ = ${JSON.stringify(lastYearOption)}
document.querySelector("#past-months").__ChartOptions__ = ${JSON.stringify(pastMonthsOption)}
document.querySelector("#past-years").__ChartOptions__ = ${JSON.stringify(pastYearsOption)}
document.querySelector("#catalogs").__ChartOptions__ = ${JSON.stringify(catalogsOption)}
echartsImporter()
</script>`
    return injectedScript
}

function bodyContentGenerator(startDate, articleCount, totalCount) {
    const resultContent = `\
<h1>${languageSelector("统计信息", "Statistics")}</h1>
<p>${languageSelector(
    `自 <b>${startDate}</b> 以来，你共发布了文章 <b>${articleCount}</b> 篇，总字数 <b>${totalCount}</b> 字。`,
    `Since <b>${startDate}</b>, you have published <b>${articleCount}</b> articles, with a total word count of <b>${totalCount}</b>.`,
)}</p>
<p>${languageSelector(
    "下面是你在过去一年中每一天输出的字数：",
    "The chart following shows the word count you outputed in the last year:"
)}</p>
<div class="media-container">
<div class="echarts-container" id="last-year"></div>
</div>
<p>${languageSelector(
    "下面是你在过去一年中每月输出的字数：",
    "The chart following shows the word count you outputed in the past 12 months:"
)}</p>
<div class="media-container">
<div class="echarts-container" id="past-months"></div>
</div>
<p>${languageSelector(
    "下面是你在过去几年中每一年输出的字数：",
    "The chart following shows the word count you outputed in the past few years:"
)}</p>
<div class="media-container">
<div class="echarts-container" id="past-years"></div>
</div>
<p>${languageSelector(
    "下面是你在各个分类下输出的字数：",
    "The chart following shows the word count you outputed in the different catalogs:"
)}</p>
<div class="media-container">
<div class="echarts-container" id="catalogs"></div>
</div>`
    return resultContent
}

/**
 * @param {number} startTime
 * @param {ArticleMetadata[]} metadataList
 * @param {number} totalWordCount
 * @returns {string}
 */
export default function (startTime, metadataList, totalWordCount) {
    const lastYearData = classifyDataByDay(metadataList)
    const multiMonthData = classifyDataByMonth(metadataList)
    const multiYearData = classifyDataByYear(metadataList)
    const multiCatalogData = classifyDataByCatalog(metadataList)

    const startDate = new Intl.DateTimeFormat().format(new Date(startTime))
    const injectedScript = injectedScriptGenerator(lastYearData, multiMonthData, multiYearData, multiCatalogData)
    const bodyContent = bodyContentGenerator(startDate, metadataList.length, totalWordCount)

    const template = `\
<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
${header(
    (config.title ?? "MarkdownBlog") +
        languageSelector("站点统计", "Statistics"),
    config.description, "../")
}
</head>
<body>
${inlineDarkmodeSwitcherScript()}
${navigator("../")}
<article>
${bodyContent}
</article>
${footer()}
${injectedScript}
</body>
</html>`
    return template
}
