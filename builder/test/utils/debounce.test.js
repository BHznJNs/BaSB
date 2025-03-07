import assert from "node:assert/strict"
import debounce from "../../../src/utils/debounce.js"
import { checkType } from "../util.js"

let flag = 0
function doSomething() {
    flag = 1
}

describe("debounce", () => {
    it("should be a function", () => {
        assert.ok(checkType(debounce, Function))
    })

    it("should returns a function", () => {
        const debounced = debounce(doSomething, 1000)
        assert.ok(checkType(debounced, Function))
    })

    it("should not return value in duration", (done) => {
        const debounced = debounce(doSomething, 1000)
        flag = 0
        debounced()

        setTimeout(() => {
            assert.equal(flag, 0)
            done()
        }, 500)
    })

    it("should return value after duration", (done) => {
        const debounced = debounce(doSomething, 1000)
        flag = 0
        debounced()

        setTimeout(async () => {
            assert.equal(flag, 1)
            done()
        }, 1500)
    })
})
