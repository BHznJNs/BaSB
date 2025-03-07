import crypto from "node:crypto"

/**
 * @param {string} data 
 * @returns {string}
 */
export default function calculateMD5(data) {
    if (typeof data !== "string") {
        console.warn("Data is not string typed: ", data)
        return null
    }
    return crypto
        .createHash("md5")
        .update(data)
        .digest("hex")
}
