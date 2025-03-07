import fs from "node:fs"
import path from "node:path"

const userConfigPath = path.join(process.cwd(), "user/build.config.js")

if (!fs.existsSync(userConfigPath)) {
    console.log("Not a valid BaSB directory.")
    process.exit(1)
}

/** @type {import("../../user/build.config").SiteConfig} */
const config = (await import("file:\\\\" + userConfigPath)).default

try {
    new URL(config.homepage)
} catch {
    console.log("Invalid homepage URL: ", config.homepage)
    process.exit(1)
}

export { config }
