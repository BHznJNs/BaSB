import defaultConfig from "../../common/default.config.js"
let finalConfig = defaultConfig 
try {
    const configModule = await import("../../user/build.config.js")
    finalConfig = configModule.default
} catch {}

export const config = finalConfig
