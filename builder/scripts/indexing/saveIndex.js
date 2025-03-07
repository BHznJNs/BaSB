import fs from "node:fs"
import path from "node:path"
import slice from "../../utils/slice.js"
import { Directory, File } from "../../utils/directory.js"
import { indexFilePath, normalizePath } from "../../utils/path.js"
import { readmeFilename } from "../../utils/filename.js"
import { config } from "../../utils/loadConfig.js"

function pathToIndexFilename(path, index) {
    const normalizedPath = normalizePath(path)
    const removedTailSlash = normalizedPath.replace(/\/$/, "")
    const filename = removedTailSlash.split("/").join("+")
    return filename + "_" + index
}

/**
 * @param {Directory} directory
 */
export default async function saveIndex(directory, recursive=true) {
    if (!fs.existsSync(indexFilePath)) {
        fs.mkdirSync(indexFilePath)
    }

    const currentFiles = []
    const currentDirs  = []
    let dirDescription

    for (const item of directory.items) {
        if (item instanceof File) {
            if (readmeFilename.includes(item.name)) {
                dirDescription = fs.readFileSync(item.path, "utf-8")
                continue
            }
            currentFiles.push({
                name: item.name,
                createTime: item.createTime,
                modifyTime: item.modifyTime,
            })
        } else if (item instanceof Directory) {
            currentDirs.push({
                name: item.name + "/",
                createTime: item.createTime,
                modifyTime: item.modifyTime,
            })
            if (recursive) {
                saveIndex(item)
            }
        } else { /* unreachable */ }
    }

    const currentDirItems = currentDirs.concat(currentFiles)    
    const sliced = slice(currentDirItems, config.pageSize)
    const count  = sliced.length

    let index = 0
    const tasks = []
    for (const slice of sliced) {
        index += 1
        const indexFileContent = {
            total: count,
            current: index,
            content: slice,
            createTime: directory.createTime,
            updateTime: directory.updateTime,
            isReversed: directory.isReversed,
            orderby: directory.orderby,
        }
        if (index === 1 && dirDescription !== undefined) {
            // directory description only appear at page 1
            indexFileContent.dirDescription = dirDescription
        }
        const task = fs.promises.writeFile(
            path.join(indexFilePath, pathToIndexFilename(directory.path, index)),
            JSON.stringify(indexFileContent),
            "utf8"
        )
        tasks.push(task)
    }
    await Promise.all(tasks)
}
