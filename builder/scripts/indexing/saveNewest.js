import { writeFile } from "node:fs/promises"
import { config } from "../../utils/loadConfig.js"
import slice from "../../utils/slice.js"
import { indexFilePath } from "../../utils/path.js"

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


export default async function(newestList) {
    const { ignoredDir } = config.newest
    const filtered = newestList.filter(item =>
        !isInIgnoredDir(item.path, ignoredDir)
    )
    const sliced = slice(filtered, config.newest.pageSize || config.pageSize)
    const count  = sliced.length

    let index = 0
    let tasks = []
    for (const slice of sliced) {
        index += 1
        const task = writeFile(indexFilePath + "newest_" + index, JSON.stringify({
            total: count,
            current: index,
            content: slice.map(item => {
                return {
                    title:      item.name,
                    link:       item.path,
                    createTime: item.createTime
                }
            }),
        }))
        tasks.push(task)
    }
    await Promise.all(tasks)
}