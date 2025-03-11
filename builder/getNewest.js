import { Directory, File } from "./utils/directory.js"
import { orderBy, readmeFilename, reverseFilename } from "./utils/filename.js"

class FileMonoStack {
    /**
     * @description the biggest at the begin and the smallest at the end.
     * @type {File[]}
     */
    children = []

    #insert = (index, item) =>
        this.children.splice(index, 0, item)
    get length() {
        return this.children.length
    }

    push(file) {
        if (!this.length) {
            this.children.push(file)
            return
        }

        for (const index in this.children) {
            const item = this.children[index]

            // Since the `createTime` is a timestamp,
            // there is no need to consider the condition of
            // the two number equals.
            if (item.createTime < file.createTime) {
                this.#insert(index, file)
                return
            }
        }
        this.children.push(file)
    }
    pop = () => this.children.shift()
    concat(other) {
        while (other.length) {
            const item = other.children.pop()
            this.push(item)
        }
    }
}

/**
 * @param {string[]} ignoredFiles 
 * @returns {(item: Directory | File) => boolean}
 */
export function isIgnoredDirResolver(ignoredFiles) {
    return (item) => {
        if (!(item instanceof Directory)) return false
        return ignoredFiles.map(name => item.has(name)).some(item => item)
    }
}

const ignoredFiles = [...readmeFilename, ...reverseFilename, ...orderBy]
/**
 * @param {Directory} dir
 * @param {((item: File | Directory) => boolean)} [ignoredPredicator]
 * @returns {FileMonoStack}
 */
export default function getNewest(dir, ignoredPredicator) {
    const fileStack = new FileMonoStack()

    for (const item of dir.items) {
        if (ignoredPredicator && ignoredPredicator(item)) continue
        if (item instanceof File) {
            if (ignoredFiles.includes(item.name)) {
                continue
            }
            fileStack.push(item)
        } else if (item instanceof Directory) {
            // recursively read folder
            const subFileStack = getNewest(item, ignoredPredicator)
            fileStack.concat(subFileStack)
        }
    }
    return fileStack
}
