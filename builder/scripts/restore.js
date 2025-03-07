import { readFileSync } from "node:fs"
import { utimesSync } from "utimes"
import { backupFilePath } from "../utils/path.js"
import { Directory } from "../utils/directory.js"

/**
 * @param {Directory} dir
 */
function restoreDir(dir) {
    // restore current directory
    utimesSync(dir.path, {
        btime: dir.createTime,
        mtime: dir.modifyTime,
    })

    for (const item of dir.items) {
        const isDir = Object.hasOwn(item, "items") 
        if (isDir) {
            // restore sub directory
            restoreDir(item)
        } else {
            // restore sub file
            utimesSync(item.path, {
                btime: item.createTime,
                mtime: item.modifyTime,
            })
        }
    }
}
const backupData = JSON.parse(readFileSync(backupFilePath, "utf-8"))
restoreDir(backupData)
