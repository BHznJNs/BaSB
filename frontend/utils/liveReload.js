function isOnPreviewServer() {
    const hostname = location.hostname
    return hostname === "localhost"
        || hostname === "127.0.0.1"
        || hostname.startsWith("192.168.")
}

export class LiveReloadWSClient {
    ws = null
    wsServerURL   = "ws://" + location.host
    isConnected   = false
    retryCount    = 0
    retryInterval = LiveReloadWSClient.defaultRetryInterval

    connect() {
        if (!LiveReloadWSClient.isAbleToConnect) {
            return
        }
        const socket = this.ws = new WebSocket(this.wsServerURL)
        socket.addEventListener("open", () => {
            this.retryCount  = 0
            this.retryInterval = LiveReloadWSClient.defaultRetryInterval
            this.isConnected = true
            console.log("[LiveReload] WebSocket connected.")
        })
        socket.addEventListener("message", event => {
            console.log("[LiveReload] WebSocket signal received: ", event)
            if (event.data === "refresh") {
                location.reload()
            }
        })
        socket.addEventListener("error", event => {
            console.error("[LiveReload] WebSocket error occurred:", event)
            this.close()
        })
        socket.addEventListener("close", event => {
            console.warn("[LiveReload] WebSocket connection closed.")
            this.close()
            if (event.code !== 1000) {
                this.reconnect()
            }
        })
    }
    reconnect() {
        if (this.isConnected) {
            return
        }
        // increase retry interval by disconnected duration
        if (this.retryCount > 10 && this.retryCount <= 20) {
            this.retryInterval = 2 * LiveReloadWSClient.defaultRetryInterval
        } else if (this.retryCount > 20) {
            this.retryInterval = 4 * LiveReloadWSClient.defaultRetryInterval
        } else {
            this.retryInterval = LiveReloadWSClient.defaultRetryInterval
        }

        // try to reconnect every 1 second
        setTimeout(() => {
            this.retryCount += 1
            this.connect()
        }, this.retryInterval)
    }
    close() {
        this.isConnected = false
        this.ws && this.ws.close()
        this.ws = null
    }

    static isAbleToConnect = isOnPreviewServer() && ("WebSocket" in window)
    static defaultRetryInterval = 1000
}
