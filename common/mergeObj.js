export default 
function mergeObj(destObj={}, srcObj={}) {
    for (const key of Object.keys(srcObj)) {
        const isDestKeyObj = typeof destObj[key] === "object"
        const isSrcKeyObj  = typeof srcObj [key] === "object"
        const isKeyInDest  = key in destObj

        if (isKeyInDest && !isDestKeyObj) {
            continue
        }
        if (isKeyInDest && isDestKeyObj) {
            if (isSrcKeyObj) {
                mergeObj(destObj[key], srcObj[key])
            }
            continue
        }
        if (!isKeyInDest) {
            if (isSrcKeyObj) {
                let clonedObj
                if (typeof structuredClone !== "undefined") {
                    // if browser supports `structuredClone`
                    clonedObj = structuredClone(srcObj[key])
                } else {
                    clonedObj = JSON.parse(JSON.stringify(srcObj[key]))
                }
                destObj[key] = clonedObj
            } else {
                destObj[key] = srcObj[key]
            }
        }
    }
    return destObj
}
