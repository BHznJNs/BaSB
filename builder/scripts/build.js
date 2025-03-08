import { writeFileSync } from "node:fs"
import homepageTemplate from "../templates/homepage.js"
import { homepagePath } from "../utils/path.js"

export default function() {
    writeFileSync(homepagePath, homepageTemplate)
}
