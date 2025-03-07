import os from "node:os"
import http from "node:http"
import { WebSocketServer } from "ws"
import express from "express"
import startWatch from "./watch.js"
import { config } from "../utils/loadConfig.js"

function getLANIpAddress() {
    const ifaces = os.networkInterfaces()
    let lanIP = null

    for (const [name, interfaces] of Object.entries(ifaces)) {
        if (name.includes("*") || !Array.isArray(interfaces)) {
            continue
        }
        for (const iface of interfaces) {
            if (iface.family !== "IPv4" ||
                iface.internal ||
                iface.address === "127.0.0.1"
            ) { continue }
            if (/wlan|wifi|wireless/i.test(name)) {
                // the IP of WLAN is prefered
                return iface.address
            }
            lanIP = iface.address
        }
    }
    return lanIP || "Unable to determine LAN IP"
}

const { port, liveReload } = config.preview

const app = express()
const server = http.createServer(app)
app.use("/preview", express.static("./"))

// --- LiveReload WebSocket server start ---
/** @type {Set<WebSocket>} */
const wsSet = new Set()
if (liveReload) {
    const wss = new WebSocketServer({ server })
    wss.on("listening",  () =>
        console.log("[LiveReload] Live server listening on port:", port))
    wss.on("connection", (ws, req) => {
        console.log("[LiveReload] Received connection from:", req.socket.remoteAddress)
        ws.on("error", () => wsSet.delete(ws))
        ws.on("close", () => wsSet.delete(ws))
        wsSet.add(ws)
    })
    wss.on("error", err =>
        console.error("[LiveReload] Caught an error:", err))
    wss.on("close", () => {
        console.log("[LiveReload] Live server closed.")
        wsSet.clear()
    })
}
// --- LiveReload WebSocket server end ---

startWatch(() => {
    wsSet.forEach(ws => ws.send("refresh"))
})

const LAN_IP = getLANIpAddress()
server.listen(port, "0.0.0.0", () => {
    // listen in both LAN and localhost
    if (LAN_IP) {
        console.log(`Listening: http://${LAN_IP}:${port}/preview/`)
    }
    console.log(`Listening: http://localhost:${port}/preview/`)
})
