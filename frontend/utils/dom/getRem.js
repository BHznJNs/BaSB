export default function() {
    const remPx = getComputedStyle(document.documentElement).fontSize
    const remInt = Number.parseInt(remPx)
    return remInt
}