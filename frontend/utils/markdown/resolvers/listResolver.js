import { List } from "../node.js"
import getIndent from "../utils/getIndent.js"

export default function listResolver(currentLine, lines) {
    const currentIndent = getIndent(currentLine)
    const currentNode = new List(currentLine)

    while (lines.length && List.isListPattern(lines[0])) {
        const nextLine = lines.shift()
        const nextIndent = getIndent(nextLine)
        const isNextOrdered = List.orderedPattern(nextLine)

        if (nextIndent > currentIndent) {
            currentNode.children.push(listResolver(nextLine, lines))
        } else if (nextIndent === currentIndent && isNextOrdered === currentNode.isOrdered) {
            currentNode.children.push(List.getContent(nextLine, isNextOrdered))
        } else {
            lines.unshift(nextLine)
            break
        }
    }
    return currentNode
}