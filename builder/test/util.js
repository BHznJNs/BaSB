export const hasProperty = (inst, prop) => {
    return (prop in inst)
}
export const checkType = (obj, type) => {
    // type -> "class" || Function || Number ...
    if (typeof type === "string") {
        return obj.toString().startsWith("class")
               || typeof obj == type
    } else {
        return (obj instanceof type)
    }
}
