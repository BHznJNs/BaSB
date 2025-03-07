function propSetter(el, props) {
    if (!props) {
        return
    }
    for (const [key, val] of Object.entries(props)) {
        if (val === undefined || val === false) {
            continue
        }
        if (val instanceof Function) {
            el[key] = val
        } else
        if (val instanceof Array) {
            el.setAttribute(key, val.join(" "))
        } else {
            el.setAttribute(key, val)
        }
    }
}

/**
 * { prop: "value" } => "prop='value'"
 * @param {Object} props 
 * @returns {string}
 */
function propToString(props) {
    function htmlValueFormater(val) {
        if (val === undefined) {
            return ''
        }
        if (val instanceof Array) {
            return val.join(" ").replaceAll("\"", "&quot;")
        }
        return val.toString().replaceAll("\"", "&quot;")
    }

    const resultPropStr = Object.entries(props)
        .filter(([_, val]) => val !== undefined || val !== false)
        .map(([key, val]) => {
            if (typeof val === "boolean") { return key }
            return`${key}="${htmlValueFormater(val)}"`})
        .join(" ")
    return resultPropStr
}

function contentSetter(el, content) {
    if (content instanceof Array) {
        // array of html element
        for (const childEl of content) {
            if (typeof childEl === "string") {
                el.appendChild(document.createTextNode(childEl))
            } else {
                el.appendChild(childEl)
            }
        }
    } else if (content instanceof HTMLElement) {
        // single element
        el.appendChild(content)
    } else if (typeof content === "string") {
        // common text
        el.textContent = content
    } else {
        throw Error("Unexpected element content: " + content)
    }
}

function selfClosingTag(tagName, props) {
    return `<${tagName}${props ? " " + propToString(props) : ""}>`
}

export default function el(tagName, content="", props=null) {
    const isContentPlainObj = content !== null
        && typeof content === "object"
        && content.constructor === Object
    if (isContentPlainObj) {
        // allow pass props as content
        props = content
        content = ""
    }

    if ("document" in globalThis) {
        // in browser
        if (tagName === "text") {
            return document.createTextNode(content)
        }

        const targetEl = document.createElement(tagName)
        propSetter(targetEl, props)
        contentSetter(targetEl, content)
        return targetEl
    } else {
        // in node.js
        if (content instanceof Array) {
            content = content.join("")
        }
        switch (tagName) {
            case "text":
                return content
            case "hr":
            case "br":
                return selfClosingTag(tagName)
            case "img":
            case "input":
                return selfClosingTag(tagName, props)
        }
        return `<${tagName}${props ? " " + propToString(props) : ""}>${content}</${tagName}>`
    }
}
