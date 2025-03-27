import getNewest, { ignoredPredicatorFactory } from "../../getNewest.js"
import saveNewest from "./saveNewest.js"
import saveIndex from "./saveIndex.js"
import saveSearchIndex from "./resolveSearch.js"
import { config } from "../../utils/loadConfig.js"
import { IGNOREDBY_NEWESTS, IGNOREDBY_SEARCH, traversal } from "../../utils/directory.js"
import { staticPath } from "../../utils/path.js"
import isEnabled from "../../../common/isEnabled.js"

export default async function() {
    const staticDir = traversal(staticPath)
    await saveIndex(staticDir)

    const newestData = getNewest(staticDir, ignoredPredicatorFactory(IGNOREDBY_NEWESTS))
    const searchData = getNewest(staticDir, ignoredPredicatorFactory(IGNOREDBY_SEARCH))
    if (isEnabled(config.newest)) await saveNewest(newestData.children)
    if (isEnabled(config.search)) await saveSearchIndex(searchData.children)
}
