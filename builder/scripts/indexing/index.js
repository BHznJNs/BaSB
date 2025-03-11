import getNewest, { isIgnoredDirResolver } from "../../getNewest.js"
import saveNewest from "./saveNewest.js"
import saveIndex from "./saveIndex.js"
import saveSearchIndex from "./resolveSearch.js"
import { config } from "../../utils/loadConfig.js"
import { traversal } from "../../utils/directory.js"
import { staticPath } from "../../utils/path.js"
import { ignoredByNewests, ignoredBySearch } from "../../utils/filename.js"
import isEnabled from "../../../common/isEnabled.js"

export default async function() {
    const staticDir = traversal(staticPath)
    await saveIndex(staticDir)

    const newestData = getNewest(staticDir, isIgnoredDirResolver(ignoredByNewests))
    const searchData = getNewest(staticDir, isIgnoredDirResolver(ignoredBySearch))
    if (isEnabled(config.newest)) await saveNewest(newestData.children)
    if (isEnabled(config.search)) await saveSearchIndex(searchData.children)
}
