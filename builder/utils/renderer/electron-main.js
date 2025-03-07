import electron from "electron"
import { config } from "../loadConfig.js"

const { app, BrowserWindow, ipcMain } = electron

let win, currentPageName
const createWindow = () => {
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    process.send({ msg: "window-ready" })
}
const loadPage = pagename => {
    currentPageName = pagename
    win.loadFile(pagename + ".html")
    win.webContents.once("did-finish-load", () => {
        process.send({ msg: "page-ready" })
    })
}

app.whenReady().then(createWindow)
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("render-ended", (_event) => {
    process.send({ msg: "render-ended" })
})
ipcMain.on("render-error", (_event, errMsg) => {
    process.send({
        msg: "render-error",
        errMsg
    })
})

const chartOptionMap = new Map([
    ["katex"    , config.katexOptions     ], 
    ["echarts"  , config.echartsOptions   ],
    ["flowchart", config.flowchartOptions ],
    ["sequence" , null                    ],
    ["gantt"    , config.ganttOptions     ],
    ["railroad" , config.railroadOptions  ]
])

process.on("message", ({ msg, pagename, chartContent, savePath }) => {
    if (msg && msg === "render-end") {
        // set timeout to prevent error:
        // [21108:0201/211111.794:ERROR:command_buffer_proxy_impl.cc(319)] GPU state invalid after WaitForGetOffsetInRange.
        setTimeout(app.quit, 10)
    }
    if (chartContent && savePath) {
        if (!chartOptionMap.has(currentPageName)) {
            console.error("Unexpected chart type: " + currentPageName)
        }
        const renderOptions = chartOptionMap.get(currentPageName)

        win.webContents.send("chart-content", {
            chartContent,
            renderOptions,
            savePath,
        })
    }
    if (pagename) {
        loadPage(pagename)
    }
})
