import assert from "node:assert/strict"
import throttle from "../../../src/utils/throttle.js"
import { checkType } from "../util.js"

function doSomething() {
    return 1
}

describe("throttle", () => {
    it("should be a function", () => {
        assert.ok(checkType(throttle, Function))
    })

    it("should returns a function", () => {
        const throttled = throttle(doSomething, 1000)
        assert.ok(checkType(throttled, Function))
    })

    it("should return value immediately", () => {
        const throttled = throttle(doSomething, 1000)
        assert.equal(throttled(), 1)
    })

    it("should invoke callback once during its waiting time", done => {
        const throttled = throttle(doSomething, 1000)
        throttled()
        setTimeout(() => {
            assert.equal(throttled(), undefined)
        }, 400)
        setTimeout(() => {
            assert.equal(throttled(), undefined)
        }, 500)
        setTimeout(() => {
            assert.equal(throttled(), undefined)
        }, 600)
        setTimeout(() => {
            assert.equal(throttled(), 1)
            done()
        }, 1200)
    })
})
