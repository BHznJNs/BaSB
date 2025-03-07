import { writeFileSync } from "node:fs"
import { Directory, File, traversal } from "../utils/directory.js"
import { backupFilePath, staticPath } from "../utils/path.js"

function preprocessDirData(dir) {
    return {
        name: dir.name,
        path: dir.path,
        createTime: dir.createTime,
        modifyTime: dir.modifyTime,
        items: dir.items.map(item => {
            if (item instanceof File) {
                return {
                    name: item.name,
                    path: item.path,
                    createTime: item.createTime,
                    modifyTime: item.modifyTime,
                }
            }
            if (item instanceof Directory) {
                return preprocessDirData(item)
            }
        })
    }
}

const staticDir = traversal(staticPath)
const processed = preprocessDirData(staticDir)
const backupData = JSON.stringify(processed)
writeFileSync(backupFilePath, backupData)
