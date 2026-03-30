import { readFileSync, existsSync, utimesSync as fsUtimesSync } from "node:fs"
import { backupFilePath } from "../utils/path.js"
import { Directory } from "../utils/directory.js"

let utimesAvailable = false
let utimesSync = null

// 尝试动态导入 utimes，如果失败则使用回退方案
try {
  const utimesModule = await import('utimes')
  utimesSync = utimesModule.utimesSync
  utimesAvailable = true
} catch (error) {
  console.warn('utimes package not available, using fs.utimesSync as fallback')
  utimesSync = (path, times) => {
    // 只设置 mtime，因为 Node.js 内置的 utimesSync 不支持 btime
    fsUtimesSync(path, new Date(times.mtime || Date.now()), new Date(times.mtime || Date.now()))
  }
}

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
      
      if (utimesAvailable) {
        // 使用 utimes 包（支持 btime）
        utimesSync(item.path, {
          btime: item.createTime,
          mtime: item.modifyTime,
        })
      } else {
        // 使用回退方案（只设置 mtime）
        utimesSync(item.path, {
          mtime: item.modifyTime
        })
      }
    }
  }
}

export default function() {
  const backupData = JSON.parse(readFileSync(backupFilePath, "utf-8"))
  restoreDir(backupData)
}
