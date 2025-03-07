import assert from "node:assert/strict"
import EventBusDev from "../../../src/utils/eventbus/dev.js"
import { hasProperty, checkType } from "../util.js"

const testInstance = new EventBusDev()
const symbolTestEvent = Symbol("test-event")
const testEventHandler = () => {
    // do something...
}

describe("EventBusDev", () => {
    it("export should be a class", () => {
        assert.ok(checkType(EventBusDev, "class"))
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

            describe("warning test", () => {
                it("could warn when add an event handler with wrong argument number",
                () => {
                    assert.ok(
                        // this should return `true`
                        testInstance.on("on()-wrong-arg-num-test-event",
                        (data) => {
                            // do something...
                        })
                    )
                    assert.ok(!(
                        // this should return `false`
                        testInstance.on("on()-wrong-arg-num-test-event",
                        (data1, data2) => {
                            // do something...
                        })
                    ))
                })
            })

            describe("normal tests", () => {
                /**
                 * Following are the same to that in `index.test.js`
                 */
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
                /**
                 * The same part end
                 */
            })
        })

        describe("off()", () => {
            it("should be a function", () => {
                assert.ok(checkType(testInstance.off, Function))
            })

            describe("warning tests", () => {
                it("could warn when an unadded event is removed",
                () => {
                    assert.ok(!(
                        testInstance.off("off()-unadded-test-event", testEventHandler)
                    ))
                })

                it("could warn when an unadded event handler is removed",
                () => {
                    const unaddedEventHandler = () => {
                        // do something...
                    }
                    testInstance.on("off()-added-test-event", testEventHandler)
                    assert.ok(!(
                        testInstance.off("off()-added-test-event", unaddedEventHandler)
                    ))
                })
            })

            describe("normal tests", () => {
                /**
                 * Following are the same to that in `index.test.js`
                 */
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
                /**
                 * The same part end
                 */
            })
        })

        describe("emit()", () => {
            it("should be a function", () => {
                assert.ok(checkType(testInstance.emit, Function))
            })

            describe("warning tests", () => {
                it("could warn when an unadded event is emitted",
                () => {
                    const someData = Math.random()

                    assert.ok(!(
                        testInstance.emit("emit()-unadded-test-event", someData)
                    ))
                })

                it("could warn when an event is emitted with wrong argument number",
                () => {
                    testInstance.on("emit()-added-test-event", (data) => {
                        // do something...
                    })

                    const someData1 = Math.random()
                    const someData2 = Math.random()

                    assert.ok(!(
                        testInstance.emit(
                            "emit()-added-test-event",
                            someData1, someData2
                        )
                    ))
                })
            })

            describe("normal tests", () => {
                /**
                 * Following are the same to that in `index.test.js`
                 */
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
                /**
                 * The same part end
                 */
            })
        })
    })
})