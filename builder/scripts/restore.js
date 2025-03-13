import { readFileSync, existsSync } from "node:fs"
import { utimesSync } from "utimes"
import { backupFilePath } from "../utils/path.js"
import { Directory } from "../utils/directory.js"

/**
 * @param {Directory} dir
 */
function restoreDir(dir) {
    for (const item of dir.items) {
        const isDir = Object.hasOwn(item, "items") 
        if (isDir) {
            // restore sub directory
            restoreDir(item)
        } else {
            // restore sub file
            if (!existsSync(item.path)) continue
            utimesSync(item.path, {
                btime: item.createTime,
                mtime: item.modifyTime,
            })
        }
    }
}

export default function() {
    const backupData = JSON.parse(readFileSync(backupFilePath, "utf-8"))
    restoreDir(backupData)
}
