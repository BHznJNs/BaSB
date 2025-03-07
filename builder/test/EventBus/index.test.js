import assert from "node:assert/strict"
import EventBus from "../../../src/utils/eventbus/index.js"
import { hasProperty, checkType } from "../util.js"

const testInstance = new EventBus()
const symbolTestEvent = Symbol("test-event")
const testEventHandler = () => {
    // do something...
}

describe("EventBus", () => {
    it("export should be a class", () => {
        assert.ok(checkType(EventBus, "class"))
    })

    it("instance should has a Map named `events`", () => {
        assert.ok(
            hasProperty(testInstance, "events") &&
            checkType(testInstance.events, Map)
        )
    })

    it("instance should has `on`, `off`, `emit` methods", () => {
        assert.ok(
            hasProperty(testInstance, "on") &&
            hasProperty(testInstance, "off") &&
            hasProperty(testInstance, "emit")
        )
    })

    describe("module methods", () => {
        const eventMap = testInstance.events

        describe("on()", () => {
            it("should be a function", () => {
                assert.ok(checkType(testInstance.on, Function))
            })

            it("could add event handler for new event", () => {
                const eventName = "test-event"
                testInstance.on(eventName, testEventHandler)

                assert.deepEqual(
                    eventMap.get(eventName),
                    [ testEventHandler ]
                )
            })

            it("could add event handler for added event", () => {
                const eventName = "test-event"
                const tempEventHandler = () => {
                    // do something...
                }
                testInstance.on(eventName, tempEventHandler)

                assert.deepEqual(
                    eventMap.get(eventName),
                    [ testEventHandler, tempEventHandler ]
                )
            })

            it("could accept handlers for any names of event, e.g. `constructor`", () => {
                testInstance.on("constructor", testEventHandler)

                assert.deepEqual(
                    eventMap.get("constructor"),
                    [ testEventHandler ]
                )
            })

            it("could take Symbols for event name", () => {
                testInstance.on(symbolTestEvent, testEventHandler)

                assert.deepEqual(
                    eventMap.get(symbolTestEvent),
                    [ testEventHandler ]
                )
            })

            it("could take duplicate handlers for the same event", () => {
                testInstance.on(symbolTestEvent, testEventHandler)

                assert.deepEqual(
                    eventMap.get(symbolTestEvent),
                    [ testEventHandler, testEventHandler ]
                )
            })
        })

        describe("off()", () => {
            it("should be a function", () => {
                assert.ok(checkType(testInstance.off, Function))
            })

            it("could remove handler for given event", () => {
                const eventName = "off-test-event"

                testInstance.on(eventName, testEventHandler)
                testInstance.off(eventName, testEventHandler)

                assert.deepEqual(eventMap.get(eventName), undefined)
            })

            it("could remove the last added handler", () => {
                assert.deepEqual(
                    eventMap.get(symbolTestEvent),
                    [ testEventHandler, testEventHandler ]
                )

                testInstance.off(symbolTestEvent, testEventHandler)

                assert.deepEqual(
                    eventMap.get(symbolTestEvent),
                    [ testEventHandler ]
                )
            })
        })

        describe("emit()", () => {
            it("should be a function", () => {
                assert.ok(checkType(testInstance.emit, Function))
            })

            it("could call the handler and pass args corresponding", () => {
                const actualData = Math.random()

                testInstance.on("handler-test", (expectData) => {
                    assert.equal(expectData, actualData)
                })
                testInstance.emit("handler-test", actualData)
            })

            it("could pass multiple arguments", () => {
                const actualData1 = Math.random()
                const actualData2 = Math.random()
                const actualData3 = Math.random()

                testInstance.on("multi-arg-test", (
                    expectData1, expectData2, expectData3
                ) => {
                    assert.equal(expectData1, actualData1)
                    assert.equal(expectData2, actualData2)
                    assert.equal(expectData3, actualData3)
                })
                testInstance.emit("multi-arg-test",
                    actualData1, actualData2, actualData3
                )
            })
        })
    })
})