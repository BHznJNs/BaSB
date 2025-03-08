import getNewest from "../../getNewest.js"
import saveNewest from "./saveNewest.js"
import saveIndex from "./saveIndex.js"
import saveSearchIndex from "./resolveSearch.js"
import { config } from "../../utils/loadConfig.js"
import { traversal } from "../../utils/directory.js"
import { staticPath } from "../../utils/path.js"
import isEnabled from "../../utils/isEnabled.js"

export default async function() {
    const staticDir = traversal(staticPath)
    await saveIndex(staticDir)

    const newests = getNewest(staticDir)
    if (isEnabled(config.newest)) await saveNewest(newests.children)
    if (isEnabled(config.search)) await saveSearchIndex(newests.children)
}
