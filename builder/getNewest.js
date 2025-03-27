import { Directory, File } from "./utils/directory.js"
import { orderBy, readmeFilename, reverseFilename } from "./utils/filename.js"

class FileMonoStack {
    /**
     * @description the biggest at the begin and the smallest at the end.
     * @type {File[]}
     */
    #children = []

    /** @returns {number} */
    get length() {
        return this.#children.length
    }

    /** @returns {File[]} */
    get children() {
        return this.#children
    }

    /** @param {File} file */
    push(file) {
        if (!this.length) {
            this.#children.push(file)
            return
        }

        for (let i = 0; i < this.#children.length; i++) {
            const item = this.#children[i]
            // Since the `createTime` is a timestamp,
            // there is no need to consider the condition of
            // the two number equals.
            if (item.createTime < file.createTime) {
                this.insert(i, file)
                return
            }
        }
        this.#children.push(file)
    }

    /** @returns {File} */
    pop = () => this.#children.shift()

    /**
     * @param {number} index 
     * @param {File} item 
     */
    insert(index, item) {
        this.#children.splice(index, 0, item)
    }

    /** @param {FileMonoStack} other */
    concat(other) {
        while (other.length) {
            const item = other.#children.pop()
            this.push(item)
        }
    }
}

/**
 * @param {Symbol} ignoredFlag 
 * @returns {(item: Directory | File) => boolean}
 */
export function ignoredPredicatorFactory(ignoredFlag) {
    return (item) => {
        if (!(item instanceof Directory)) return false
        return item.ignoredBy === ignoredFlag
    }
}

const ignoredFiles = [...readmeFilename, ...reverseFilename, ...orderBy]
/**
 * @param {Directory} dir
 * @param {((item: File | Directory) => boolean)} [ignoredPredicator] if true, ignore the item
 * @returns {FileMonoStack}
 */
export default function getNewest(dir, ignoredPredicator) {
    const fileStack = new FileMonoStack()

    for (const item of dir.items) {
        if (ignoredPredicator && ignoredPredicator(item)) continue
        if (item instanceof File) {
            if (ignoredFiles.includes(item.name)) continue
            fileStack.push(item)
        } else if (item instanceof Directory) {
            // recursively read folder
            const subFileStack = getNewest(item, ignoredPredicator)
            fileStack.concat(subFileStack)
        }
    }
    return fileStack
}
