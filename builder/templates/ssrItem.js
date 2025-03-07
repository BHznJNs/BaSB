import {
    htmlLang, header, navigator, footer,
    inlineDarkmodeSwitcherScript,
    loadExtraScripts,
} from "./snippets.js"
import { config } from "../utils/loadConfig.js"
import languageSelector from "../utils/languageSelector.js"

export default function(title, body, source) {
    return `\
<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
${header(title, undefined, "../")}
</head>
<body>
${inlineDarkmodeSwitcherScript()}
${navigator("../", false, true)}
<article>
${body}
<p><a href="${config.homepage + "#" + source}">
    ${languageSelector("点此查看原文", "Click here to read original article")}
</a></p>
</article>
${footer()}
${loadExtraScripts("../")}
</body>
</html>`
}
