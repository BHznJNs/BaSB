import fs from "node:fs"
import path from "node:path"
import childProcess from "node:child_process"

import { packageMetadata } from "../utils/loadPackageMetadata.js"
import languageSelector from "../utils/languageSelector.js"
import { templatePath } from "../utils/path.js"

async function updateNpmPackage(packageName) {
    try {
        const command = `npm update ${packageName} -g`
        const output = childProcess.execSync(command, { encoding: 'utf-8' })
        console.log(
            languageSelector(
                `包 ${packageName} 版本更新成功：\n${output}`,
                `Successfully updated package ${packageName}:\n${output}`))
    } catch (error) {
        console.error(languageSelector(
            `更新包 ${packageName} 失败:\n${error.stderr}`,
            `Failed to update package ${packageName}:\n${error.stderr}`))
    }
}

const filesNeedToUpgrade = [
    "./dist/",
    "./sw.js",
]

export default function() {
    const { name: packageName } = packageMetadata
    updateNpmPackage(packageName)

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
