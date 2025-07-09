/**
 * @param {object} obj original object that may have undefined fields
 * @returns {object} new object that without undefined fields
 */
export default function removeUndefinedFields(obj) {
    const newObj = {}
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
            newObj[key] = obj[key]
        }
    }
    return newObj
}
