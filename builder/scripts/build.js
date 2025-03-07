import { writeFileSync } from "node:fs"
import homepageTemplate from "../templates/homepage.js"
import { homepagePath } from "../utils/path.js"

writeFileSync(homepagePath, homepageTemplate)
