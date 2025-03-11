import fs from "node:fs"
import path from "node:path"
import { templatePath } from "../utils/path.js"
import { packageMetadata } from "../utils/loadPackageMetadata.js"
import languageSelector from "../utils/languageSelector.js"

export default function(targetDirname) {
    const targetPath = path.join(process.cwd(), targetDirname)
    fs.cpSync(templatePath, targetPath, { recursive: true })
    console.log(
`\
${languageSelector("创建完成。现在请运行：", "Created. Now run:")}

cd ${targetDirname}
${packageMetadata.name} build
${packageMetadata.name} preview
`
    )
}
