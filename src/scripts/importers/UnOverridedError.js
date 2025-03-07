export default class UnOverridedError extends Error {
    constructor(name) {
        super()
        this.message =
            `"${name}" is a abstract method that should be overrided.`
    }
}
