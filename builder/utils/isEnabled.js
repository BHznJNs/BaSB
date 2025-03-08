/**
 * @param {import("../../types/optionalComponentConfig").OptionalComponentConfig | undefined} config 
 * @returns {boolean} isEnabled
 */
export default function isEnabled(config) {
    return (config != undefined) && config.enable
}