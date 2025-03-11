import path from "node:path"
import { fileURLToPath } from "node:url"

export const homepagePath = "index.html"
export const staticPath = "static/"
export const indexFilePath = ".index/"
export const ssrResourcePath = "pages/"
export const ssrCachePath = "pages/cache.json"
export const ssrListPath  = "pages/index.html"
export const rssFilePath = "user/rss.xml"
export const countPagePath = "user/count.html"
export const backupFilePath = "user/backup.json"

export const templatePath = (() => {
    const relativeTemplatePath = "../../../template/"
    return path.join(fileURLToPath(import.meta.url), relativeTemplatePath)
})()

export function normalizePath(filePath) {
    return filePath.replace(/\\/g, "/")
}
