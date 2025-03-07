import fs from "node:fs"
import path from "node:path"
import { orderbyCreateTime, orderbyFilename, orderbyModifyTime, reverseFilename } from "./filename.js"
import { ssrResourcePath } from "./path.js"

const ORDERBY_CREATE_TIME = 0
const ORDERBY_MODIFY_TIME = 1
const ORDERBY_FILENAME = 2

/**
 * @param {string} dirPath A path for a directory
 * @returns {Directory}
 */
export function traversal(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.error(`Path ${dirPath} does not exist!`)
        return
    }
    const pathStat = fs.statSync(dirPath)
    if (!pathStat.isDirectory()) {
        console.error(`Path ${dirPath} is not a directory!`)
        return
    }

    const dirCreateTime = pathStat.birthtime.getTime()
    const currentDir = new Directory(path.basename(dirPath), dirPath, dirCreateTime)
    const dirContent = fs.readdirSync(dirPath)

    for (const item of dirContent) {
        const itemPath = path.posix.join(dirPath, item)
        const itemStat = fs.statSync(itemPath)
        const itemCreateTime = itemStat.birthtime.getTime()
        const itemModifyTime = itemStat.mtime.getTime()
        if (itemStat.isDirectory()) {
            if (item.startsWith(".")) {
                // ignore directories whose name starts with '.'
                continue
            }
            const subDir = traversal(itemPath)
            currentDir.modifyTime = Math.max(currentDir.modifyTime, subDir.modifyTime)
            currentDir.updateTime = Math.max(currentDir.updateTime, subDir.updateTime)
            currentDir.items.push(subDir)
        } else {
            if (orderbyCreateTime.includes(item)) {
                currentDir.orderby = ORDERBY_CREATE_TIME; continue
            } else if (orderbyModifyTime.includes(item)) {
                currentDir.orderby = ORDERBY_MODIFY_TIME; continue
            } else if (orderbyFilename.includes(item)) {
                currentDir.orderby = ORDERBY_FILENAME; continue
            }
            if (reverseFilename.includes(item)) {
                currentDir.isReversed = true; continue
            }
            const file = new File(item, itemPath, itemCreateTime, itemModifyTime)
            currentDir.modifyTime = Math.max(currentDir.modifyTime, itemModifyTime)
            currentDir.updateTime = Math.max(currentDir.updateTime, itemCreateTime)
            currentDir.items.push(file)
        }
    }
    currentDir.resort()
    return currentDir
}

export class Directory {
    name  = ""
    path  = ""
    items = [] // [`Directory` | `File`]
    createTime = 0
    modifyTime = 0
    updateTime = 0
    isReversed = false
    orderby = ORDERBY_CREATE_TIME

    constructor(name, path, createTime) {
        this.name = name
        this.path = path
        this.createTime = createTime
        this.modifyTime = createTime
        this.updateTime = createTime
    }

    resort() {
        this.items.sort((a, b) => {
            // put directories at the front
            if (a instanceof Directory && b instanceof File) {
                return -1
            }
            if (b instanceof Directory && a instanceof File) {
                return 1
            }
    
            let cmpResult
            if (this.orderby === ORDERBY_CREATE_TIME) {
                // newer at the fronter position
                cmpResult = b.createTime - a.createTime
            } else if (this.orderby === ORDERBY_MODIFY_TIME) {
                cmpResult = b.modifyTime - a.modifyTime
            } else if (this.orderby === ORDERBY_FILENAME) {
                // a-z order
                cmpResult = a.name.localeCompare(b.name)
            } else {/* unreachable */}
            return this.isReversed ? -cmpResult : cmpResult
        })
    }

    static clear(path) {
        if (!fs.existsSync(path)) {
            return
        }
    
        const dirContent = fs.readdirSync(path)
        for (const file of dirContent) {
            const filePath = path + file
            const isFile = fs.statSync(filePath).isFile()
            if (isFile) {
                fs.unlinkSync(filePath)
            }
        }
    }
}

export class File {
    constructor(name, filePath, createTime, modifyTime) {
        const filenameWithoutExt = path.basename(name, path.extname(name))
        this.name = name
        this.nameWithoutExt = filenameWithoutExt
        this.path = filePath
        this.ssrPath = ssrResourcePath + filenameWithoutExt + ".html"
        this.createTime = createTime
        this.modifyTime = modifyTime
    }
}
