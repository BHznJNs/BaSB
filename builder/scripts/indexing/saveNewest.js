import { writeFile } from "node:fs/promises"
import { config } from "../../utils/loadConfig.js"
import slice from "../../utils/slice.js"
import { indexFilePath } from "../../utils/path.js"

export default async function(newestList) {
    const sliced = slice(newestList, config.newest.pageSize || config.pageSize)
    const count  = sliced.length

    let index = 0
    let tasks = []
    for (const slice of sliced) {
        index += 1
        const task = writeFile(indexFilePath + "newest_" + index, JSON.stringify({
            total: count,
            current: index,
            content: slice.map(item => {
                const staticPrefix = "static/"
                const actualPath = item.path.startsWith(staticPrefix)
                    ? item.path.slice(staticPrefix.length)
                    : item.path
                return {
                    title:      item.name,
                    link:       actualPath,
                    createTime: item.createTime
                }
            }),
        }))
        tasks.push(task)
    }
    await Promise.all(tasks)
}