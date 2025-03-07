/**
 * @description
 * ```
 * [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *                             ||
 *                             ||
 *                             \/
 * [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
 * ```
 * @param {Array<T>} itemList the list to be sliced
 * @param {number} pageSize the size of every sliced list
 * @returns {Array<T>} sliced lists
 */
export default function(itemList, pageSize) {
    let startIndex = 0
    let remainItemCount = itemList.length - (startIndex + 1)
    if (remainItemCount <= pageSize) {
        return [ itemList ]
    }
    const slices = []
    while (remainItemCount > pageSize) {
        const listSlice = itemList.slice(startIndex, startIndex + pageSize)
        slices.push(listSlice)
        remainItemCount -= pageSize
        startIndex += pageSize
    }
    if (itemList.length) {
        const listSlice = itemList.slice(startIndex, startIndex + pageSize)
        slices.push(listSlice)
    }
    return slices
}
