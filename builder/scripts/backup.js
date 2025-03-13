import { writeFileSync } from "node:fs"
import { Directory, File, traversal } from "../utils/directory.js"
import { reverseFilename, orderBy, ignoredBy } from "../utils/filename.js"
import { backupFilePath, staticPath } from "../utils/path.js"

function preprocessDirData(dir) {
    const ignoredFilenames = [...reverseFilename, ...orderBy, ...ignoredBy]
    return {
        name: dir.name,
        path: dir.path,
        createTime: dir.createTime,
        modifyTime: dir.modifyTime,
        items: dir.items
            .filter(item => !ignoredFilenames.includes(item.name))
            .map(item => {
                if (item instanceof File) {
                    return {
                        name: item.name,
                        path: item.path,
                        createTime: item.createTime,
                        modifyTime: item.modifyTime,
                    }
                } else
                if (item instanceof Directory) {
                    return preprocessDirData(item)
                }
            })
    }
}

export default function() {
    const staticDir = traversal(staticPath)
    const processed = preprocessDirData(staticDir)
    const backupData = JSON.stringify(processed)
    writeFileSync(backupFilePath, backupData)
}
