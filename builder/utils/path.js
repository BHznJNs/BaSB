export const homepagePath = "index.html"
export const staticPath = "static/"
export const indexFilePath = ".index/"
export const ssrResourcePath = "pages/"
export const ssrCachePath = "pages/cache.json"
export const ssrListPath  = "pages/index.html"
export const rssFilePath = "user/rss.xml"
export const countPagePath = "user/count.html"
export const backupFilePath = "user/backup.json"

export function normalizePath(filePath) {
    return filePath.replace(/\\/g, "/")
}
