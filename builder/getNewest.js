import { Directory, File } from "./utils/directory.js"
import { orderby, readmeFilename, reverseFilename } from "./utils/filename.js"

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

const ignoredFiled = [...readmeFilename, ...reverseFilename, ...orderby]
export default function getNewest(dir) {
    const fileStack = new FileMonoStack()

    for (const item of dir.items) {
        if (item instanceof File) {
            if (ignoredFiled.includes(item.name)) {
                continue
            }
            fileStack.push(item)
        } else if (item instanceof Directory) {
            // recursively read folder
            const subFileStack = getNewest(item)
            fileStack.concat(subFileStack)
        }
    }
    return fileStack
}
