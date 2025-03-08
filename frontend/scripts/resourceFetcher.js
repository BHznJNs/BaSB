let controller = null

export async function fetchJSON(path) {
    controller && controller.abort()
    controller = new AbortController()

    return await fetch(path, { signal: controller.signal })
        .then(async res => {
            const json = await res.json()
            controller = null
            return json
        })
        .catch(err => {
            console.log("JSON request error: " + path)
            console.error(err)
            return null
        })
}

export async function fetchMD(path) {
    controller && controller.abort()
    controller = new AbortController()

    return await fetch(path, { signal: controller.signal })
        .then(async res => {
            if (res.status != 200) {
                throw res.status
            }
            const text = await res.text()
            controller = null
            return text
        })
        .catch(err => {
            if (typeof err != "number") {
                console.error(err)
                return null
            }

            switch (err) {
                // render error code in markdown format
                case 404:
                    return "# 404 Not Found"
                case 500:
                    return "# 500 Internal Server Error"
                case DOMException:
                    console.error(err)
                    break
                default:
                    console.log("Markdown request error: " + path)
                    console.error(err)
                    return "# Unexpected request error"
            }
        })
}
