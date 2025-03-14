import fs from "node:fs"
import path from "node:path"

import { packageMetadata } from "../utils/loadPackageMetadata.js"
import languageSelector from "../utils/languageSelector.js"
import { templatePath } from "../utils/path.js"

const filesNeedToUpgrade = [
    "./dist/",
    "./sw.js",
]

export default function() {
    const { name: packageName } = packageMetadata

    const cwd = process.cwd()
    for (const file of filesNeedToUpgrade) {
        const srcPath = path.join(templatePath, file)
        const destPath = path.join(cwd, file)
        fs.rmSync(destPath, { recursive: true })
        fs.cpSync(srcPath, destPath, { recursive: true })
    }
    console.log(languageSelector(
        `${packageName} 升级成功。`,
        `${packageName} upgraded successfully.`))
}
