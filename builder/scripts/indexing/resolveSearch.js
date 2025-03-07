import fs from "node:fs"
import { config } from "../../utils/loadConfig.js"
import mdResolver from "../../utils/markdown/index.js"
import { indexFilePath } from "../../utils/path.js"
import { DetailsBlock, Headline, List, Para, Quote } from "../../utils/markdown/node.js"
import flexsearch from "../../../src/libs/flexsearch/flexsearch.bundle.module.min.js"
import countWord, { tokenize } from "../../../src/utils/countWord.js"
import { getRawContent } from "../../../src/utils/markdown/inline.js"

const indexFactory = () => new flexsearch.Index({
        preset: "default",
        optimize: true,
        encode: tokenize,
    })

// convert a markdown document into raw text
function nodeResolver(node) {
    function listResolver(listNode) {
        const childrenContent = listNode.children.map(child => {
            if (typeof child === "string") {
                // common list item
                return getRawContent(child)
            } else if (typeof child.content === "string") {
                // task list item
                return getRawContent(child.content)
            } else {
                // sub list
                return listResolver(child)
            }
        })
        return childrenContent.join("")
    }

    if (node instanceof Quote) {
        return node.children.map(nodeResolver)
    }
    if (node instanceof List) {
        return listResolver(node)
    }

    let contentItem
    if (node instanceof Headline) {
        contentItem = node.content
    } else if (node instanceof Para) {
        contentItem = node.content
    } else if (node instanceof DetailsBlock) {
        contentItem = node.summary
    } else {
        return ""
    }
    return getRawContent(contentItem)
}

function getSearchIndexData(newestList) {
    const dataList = []
    const wordCountThreshold = config.search.pageThreshold

    let currentId    = 0
    let currentCount = 0
    let currentIndex = indexFactory()
    let currentIdMap = []

    const pushData = () => {
        dataList.push({
            index: currentIndex,
            idMap: currentIdMap,
        })
        currentId    = -1
        currentCount = 0
        currentIndex = indexFactory()
        currentIdMap = []
    }

    for (let i=0; i<newestList.length; i++, currentId++) {
        const file = newestList[i]

        const fileContent = fs.readFileSync(file.path, "utf-8")
        const structure = mdResolver(fileContent)
        const articleRawContent = structure
            .map(nodeResolver)
            .join("")

        currentCount += countWord(articleRawContent)
        if (currentCount >= wordCountThreshold) {
            pushData()
            continue
        }

        currentIdMap.push(file.path.replace("static/", ""))
        currentIndex.add(currentId, articleRawContent)
    }
    pushData()
    return dataList
}

export default async function(newestList) {
    const searchIndexPath = index => indexFilePath + `search-index_${index}.json`
    const dataList = getSearchIndexData(newestList)

    for (let i=0; i<dataList.length; i++) {
        const { index, idMap } = dataList[i]
        const indexData = {}

        await index.export((key, data) => indexData[key] = data)
        const indexFileContent = `{\
"maxId":${dataList.length - 1},
"idMap":${JSON.stringify(idMap)},
"reg":${indexData.reg},
"cfg":${indexData.cfg},
"map":${indexData.map},
"ctx":${indexData.ctx}\
}`
        fs.writeFileSync(searchIndexPath(i), indexFileContent)
    }
}
