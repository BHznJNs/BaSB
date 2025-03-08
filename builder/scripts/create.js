import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

export default function(targetDirname) {
    const templatePath = path.join(fileURLToPath(import.meta.url), "../../../template")
    const targetPath = path.join(process.cwd(), targetDirname)
    fs.cpSync(templatePath, targetPath, { recursive: true })
}
