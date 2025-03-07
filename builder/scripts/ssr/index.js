import fs from "node:fs"
import path from "node:path"
import rssFileFactory, { RSSItem } from "./rssFileFactory.js"
import { analyze, renderToHTML } from "./ssrItemRenderer.js"
import getNewest from "../../getNewest.js"
import staticList from "../../templates/ssrList.js"
import { config } from "../../utils/loadConfig.js"
import { traversal } from "../../utils/directory.js"
import { staticPath, rssFilePath, ssrResourcePath, ssrCachePath, ssrListPath } from "../../utils/path.js"
import { execute as executeImagesRendering } from "../../utils/renderer/index.js"
import calculateMD5 from "../../utils/md5.js"

function isInIgnoredDir(path, ignoredDirs) {
    if (!ignoredDirs) {
        return false
    }

    for (const dirName of ignoredDirs) {
        if (path.startsWith(staticPath + dirName)) {
            return true
        }
    }
    return false
}

/**
 * @param {string[]} pathList 
 * @returns {Promise<Map<string, string>>}
 */
async function readAllArticles(pathList) {
    const fileMap = new Map()
    const tasks = pathList.map(async path => {
        const content = await fs.promises.readFile(path, "utf8")
        fileMap.set(path, content);
    })
    await Promise.all(tasks)
    return fileMap
}

class SSRResourceCache {
    constructor(cachePath) {
        this.cache = JSON.parse(fs.readFileSync(cachePath))
        this.filesToDelete = new Set(Object.keys(this.cache))
    }
    get(key) {
        this.filesToDelete.delete(key)
        return this.cache[key]
    }
    set(key, value) {
        this.cache[key] = value
    }
}

if (config.rss.enable) {
    if (!fs.existsSync(ssrResourcePath)) {
        fs.mkdirSync(ssrResourcePath)
    }
    if (!fs.existsSync(ssrCachePath)) {
        fs.writeFileSync(ssrCachePath, "{}")
    }
    globalThis.__SSRCache__ = new SSRResourceCache(ssrCachePath)

    const staticDir = traversal(staticPath)
    const newestItems = getNewest(staticDir)
    const fileCache = await readAllArticles(newestItems.children.map(item => item.path))
    const tasks = []
    for (const file of newestItems.children) {
        const fileContent = fileCache.get(file.path)
        const currentMD5 = calculateMD5(fileContent)
        const MD5InCache = globalThis.__SSRCache__.get(file.path)
        const isInCache  = MD5InCache !== undefined

        globalThis.__ResourcePath__ = new URL(path.dirname(file.path), config.homepage).toString()
        if (isInCache && currentMD5 === MD5InCache) {
            analyze(fileContent)
            globalThis.__ResourcePath__ = undefined
            continue
        }

        globalThis.__SSRCache__.set(file.path, currentMD5)
        globalThis.__IframeCounter__ = 0
        const rendered = renderToHTML(file.path, fileContent)
        globalThis.__ResourcePath__ = undefined
        tasks.push(fs.promises.writeFile(file.ssrPath, rendered))
    }

    const rssCapacity = config.rss.size
    const rssIgnoredDirs = config.rss.ignoredDir
    const rssItems = newestItems.children
        .filter(item => !isInIgnoredDir(item.path, rssIgnoredDirs))
        .slice(0, rssCapacity)
        .map(article => RSSItem.from(article))
    const rssContent = rssFileFactory(rssItems)
    const ssrListContent = staticList(newestItems.children)

    await Promise.all([
        ...tasks,
        executeImagesRendering(),
        fs.promises.writeFile(rssFilePath, rssContent),
        fs.promises.writeFile(ssrListPath, ssrListContent),
        fs.promises.writeFile(ssrCachePath, JSON.stringify(globalThis.__SSRCache__.cache))
    ])
}
