export default class EventBus {
    // A map used to store events and handlers for events
    events = new Map()

    /**
     * @name emit
     * @description to trigger the handlers for the given event name
     * @param { String | Symbol } name event name
     * @param { Array<any> }      args use `...` to support multi-arg
     */
    emit(name, ...args) {
        const targetEvent = this.events.get(name)

        if (targetEvent) {
            targetEvent.forEach((handler) => {
                handler.apply(null, args)
            })
        }
    }

    /**
     * @name on
     * @description to add event listener & register the given event handler
     * @param { String | Symbol } name event name
     * @param { EventHandler } handler given handler to given event
     */
    on(name, handler) {
        const targetEvent = this.events.get(name)

        if (targetEvent) {
            targetEvent.push(handler)
        } else {
            this.events.set(name, [handler])
        }
    }

    /**
     * @name off
     * @description remove the given handler to the given event
     * @param { String | Symbol } name event name
     * @param { EventHandler } handler given handler to given event
     */
    off(name, handler) {
        const targetEvent = this.events.get(name)

        if (targetEvent) {
            if (targetEvent.length === 1) {
                this.events.delete(name)
            } else {
                const handlerIndex = targetEvent.indexOf(handler)
                targetEvent.splice(handlerIndex, 1)
            }
        }
    }
}