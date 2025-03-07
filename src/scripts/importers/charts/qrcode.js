import umdImporter from "../umd.js"
import ChartImporter from "./importer.js"
import { config } from "../../../utils/loadConfig.js"

const { qrcodeOptions: globalQRCodeOptions } = config

class QRCodeImporter extends ChartImporter {
    _targetElList = () => document.querySelectorAll(".qrcode-container")

    // dark mode event listener
    #darkmodeObserver = new MutationObserver(this.renderAll.bind(this))

    renderItem(el) {
        // get current front color and background color
        const computedStyle    = getComputedStyle(document.body)
        const frontColor       = computedStyle.getPropertyValue("--default-tx-color")
        const backgroundColor  = computedStyle.getPropertyValue("--chart-bg-color")

        const instOptions      = Object.assign({}, globalQRCodeOptions)
        const qrcodeContent    = el.__QRCodeContent__
        const qrcodeWidth      = instOptions.width || 256 // default width
        instOptions.color      = frontColor
        instOptions.background = backgroundColor
        instOptions.content    = qrcodeContent
            || instOptions.content // global qrcode content
            || (() => {throw new Error("No QRCode content provided.")})()

        const qrcodeInst = new this._module(instOptions)
        el.style.width   = qrcodeWidth + "px"
        el.innerHTML     = qrcodeInst.svg()
    }

    async importModule() {
        const QRCode = await umdImporter("./dist/libs/qrcode-svg/qrcode.min.js", "QRCode")
        const body = document.body
        this.#darkmodeObserver.observe(body, {
            attributes: true,
            attributeFilter: ["class"]
        })
        return QRCode
    }
}

const inst = new QRCodeImporter()
export default inst.render.bind(inst)
