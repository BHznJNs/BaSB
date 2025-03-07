import fs from "node:fs"
import path from "node:path"
import chokidar from "chokidar"
import getNewest from "../getNewest.js"
import saveIndex from "./indexing/saveIndex.js"
import saveNewest from "./indexing/saveNewest.js"
import { config } from "../utils/loadConfig.js"
import { staticPath } from "../utils/path.js"
import { readmeFilename } from "../utils/filename.js"
import { traversal } from "../utils/directory.js"
import debounce from "../../src/utils/debounce.js"

async function update() {
    const staticDir = traversal(staticPath)
    await saveIndex(staticDir)

    const newests = getNewest(staticDir)
    if (config.newest.enable) {
        await saveNewest(newests.children)
    }
}

export default function entry(onChangeCallback) {
    onChangeCallback = onChangeCallback instanceof Function ? onChangeCallback : () => {}
    if (!fs.existsSync(staticPath)) {
        return
    }

    const watcher = chokidar.watch(staticPath, {
        ignored: /^\./, // ignore hidden files & folders
        persistent: true,
        ignoreInitial: true,
        depth: Infinity,
    })
    process.on("SIGINT", () => {
        console.log("Closing watcher...")
        watcher.close().then(() => {
            console.log("Watcher closed. Exiting process.")
            process.exit(0)
        })
    })
    watcher
        .on("add"      , update)
        .on("unlink"   , update)
        .on("addDir"   , update)
        .on("unlinkDir", update)
        .on("change"   , debounce((filePath) => {
            if (readmeFilename.includes(path.basename(filePath))) {
                update();
            }
            onChangeCallback()
        }, 100))
    update()
    console.log("Start watching static directory.")
}

if (import.meta.url === `file://${process.argv[1]}`) {
    entry()
}
