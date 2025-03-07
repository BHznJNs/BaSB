export default function(line) {
    let indentCount = 0
    let spaceCount = 0

    for (const ch of line) {
        if (ch.match(/[^\s\t]/)) {
            break
        }

        if (ch === "\t") {
            indentCount += 1
            continue
        }
        if (ch === " ") {
            spaceCount += 1
        }
        if (spaceCount === 2) {
            spaceCount = 0
            indentCount += 1
        }
    }
    return indentCount
}
