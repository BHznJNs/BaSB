import fs from "node:fs"
import getNewest from "../../getNewest.js"
import countTemplate from "../../templates/count.js"
import { traversal } from "../../utils/directory.js"
import { countPagePath } from "../../utils/path.js"
import mdResolver from "../../utils/markdown/index.js"

function countFile(path) {
    const content = fs.readFileSync(path, "utf-8")
    const structure = mdResolver(content)
    const wordCount = structure.reduce((accumulator, current) => {
        const count = current.count()
        if (typeof count !== "number") {
            console.warn("Unexpected count: ", count)
            console.warn("Occured by node: ", current)
            return accumulator
        }
        return accumulator + count}
    , 0)
    return wordCount
}

function getFileCatalog(path) {
    // path format:
    // static/<catalog>/...subfolders.../<filename>.md
    if (typeof path !== "string" || !path.startsWith("static/")) {
        throw new Error("Invalid file path. It should start with \"static/\"");
    }
    const pathWithoutStatic = path.substring(7)
    const firstSlashIndex = pathWithoutStatic.indexOf("/")
    if (firstSlashIndex === -1) {
        return pathWithoutStatic
    }
    return pathWithoutStatic.substring(0, firstSlashIndex)
}

const staticDir = traversal("static")
const newests = getNewest(staticDir)

// total word count & write dates & catalogs
const metadataList  = []
let totalWordCount = 0
for (const file of newests.children) {
    const date  = file.createTime
    const count = countFile(file.path)
    const catalog = getFileCatalog(file.path)

    metadataList.push({ date, count, catalog })
    totalWordCount += count
}

// start writing date
const firstArticle = newests.children[newests.length - 1]
const startTime = firstArticle.createTime
const pageContent = countTemplate(startTime, metadataList, totalWordCount)
fs.writeFileSync(countPagePath, pageContent)
