import { Table } from "../node.js"

// input: "| content | content |""
// output: ["content","content"]
function tableLineConverter(tableLine) {
    const splited = tableLine.split("|")
    const result = splited
        .filter(item => item.length > 0)
        .map(item => item.trim())
    return result
}

export default function(firstLine, lines) {
    const headerText = firstLine
    const contentLines = []

    while (lines.length) {
        const l = lines.shift()

        if (Table.pattern(l)) {
            contentLines.push(l)
        } else {
            lines.unshift(l)
            break
        }
    }

    const headerCells = tableLineConverter(headerText)
    const contentRows = contentLines.map(tableLineConverter)
    const tableNode = new Table(headerCells, contentRows)
    return tableNode
}
