import QRCode from "../../../src/libs/qrcode-svg/qrcode.js"
import { config } from "../loadConfig.js"

const { qrcodeOptions: globalQRCodeOptions } = config

export default function(qrcodeContent, savePath) {
    const instOptions = Object.assign({}, globalQRCodeOptions)
    instOptions.content = qrcodeContent
        || instOptions.content // global qrcode content
        || (() => {throw new Error("No QRCode content provided.")})()

    const qrcodeInst = new QRCode(instOptions)
    qrcodeInst.save(savePath)
}
