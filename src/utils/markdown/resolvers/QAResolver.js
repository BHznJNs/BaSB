import { Answer, QABlock, Question } from "../node.js"

export default function QAResolver(firstLine, lines) {
    const block = new QABlock()
    lines.unshift(firstLine)

    while (lines.length) {
        const line = lines[0]
        const isQuestion = Question.pattern(line)
        const isAnswer = Answer.pattern(line)

        if (isQuestion) {
            block.push(new Question(line))
        } else
        if (isAnswer) {
            block.push(new Answer(line))
        } else {
            // !isQuestion && !isAnswer
            break
        }
        lines.shift()
    }
    return block
}
