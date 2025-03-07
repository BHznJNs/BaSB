import getNewest from "../../getNewest.js"
import saveNewest from "./saveNewest.js"
import saveIndex from "./saveIndex.js"
import saveSearchIndex from "./resolveSearch.js"
import { config } from "../../utils/loadConfig.js"
import { traversal } from "../../utils/directory.js"
import { staticPath } from "../../utils/path.js"

const staticDir = traversal(staticPath)
await saveIndex(staticDir)

const newests = getNewest(staticDir)
if (config.newest.enable) {
    await saveNewest(newests.children)
}
if (config.search.enable) {
    await saveSearchIndex(newests.children)
}
