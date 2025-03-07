export default function umdImporter(path, name) {
    const scriptEl = document.createElement("script")
    scriptEl.src   = path
    scriptEl.type  = "text/javascript"
    document.head.appendChild(scriptEl)
    return new Promise((resolve, reject) => {
        scriptEl.onload = function() {
            if (!(name in globalThis)) {
                const errMsg = `Module ${name} does not support this import method.`
                console.error(errMsg)
                reject(errMsg)
            }

            const localModuleObj = globalThis[name]
            globalThis[name] = undefined
            resolve(localModuleObj)
        }
        scriptEl.onerror = function(err) {
            console.error(`Error loading dynamically imported module "${name}": ${path}`)
            reject(err)
        }
    })
}
