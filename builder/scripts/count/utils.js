export function formatEchartsDate(timestamp) {
    const date  = new Date(timestamp)
    const year  = date.getFullYear()
    const month = date.getMonth() + 1
    const day   = date.getDate()
    return `${year}-${month}-${day}`
}

export function insertDataIntoMap(map, kvPair, defaultValue = 0, valueAccumulator = (oldVal, newVal) => oldVal + newVal) {
    if (!map.has(kvPair[0])) {
        map.set(kvPair[0], defaultValue)
    }
    const currentValue = map.get(kvPair[0])
    map.set(kvPair[0], valueAccumulator(currentValue, kvPair[1]))
}
