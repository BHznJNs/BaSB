// ("abc]", "]") -> "abc"
export default function getInterval(text, startSign, endSign, includeEscape=false) {
    if (!text.includes(endSign)) {
        return null
    }

    let intervalText = ""
    let signCount = 0
    let isEscape = false

    while (text.length) {
        const ch = text.slice(0, 1)
        text = text.substr(1)

        if (ch === "\\") {
            isEscape = !isEscape
            if (!includeEscape) {
                continue
            }
        }
        if (ch === startSign && !isEscape) {
            signCount += 1
            intervalText += ch
            continue
        }
        if (ch === endSign && !isEscape) {
            if (signCount > 0) {
                signCount -= 1
                intervalText += ch
                continue
            }
            break
        }
        intervalText += ch
        isEscape = false
    }

    return intervalText
}
