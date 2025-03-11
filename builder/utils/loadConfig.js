import fs from "node:fs"
import path from "node:path"

const userConfigPath = path.join(process.cwd(), "user/build.config.js")
const isValidDirectory = fs.existsSync(userConfigPath)

/** @type {import("../../types/index.d.ts").SiteConfig} */
const config = (await import(
    isValidDirectory
        ? "file:\\\\" + userConfigPath
        : "../../common/default.config.js"
)).default

try {
    new URL(config.homepage)
} catch {
    console.error("Invalid homepage URL: ", config.homepage)
    process.exit(1)
}

export { isValidDirectory, config }
