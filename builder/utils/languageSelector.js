import { config } from "./loadConfig.js"

const currentLang = config.language
const langList = ["zh", "en"]
function languageSelectorCreator(lang) {
    for (const [index, langName] of Object.entries(langList)) {
        if (lang === langName) {
            return (...selections) => selections[index]
        }
    }
    console.warn("Unexpected language: " + lang)
    // default returns English text
    return (...selections) => selections[1]
}
const languageSelector = languageSelectorCreator(currentLang)
export default languageSelector
