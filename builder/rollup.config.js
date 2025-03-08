import path from "node:path"
import terser from "@rollup/plugin-terser"
import dynamicImportVariables from "@rollup/plugin-dynamic-import-vars"
import copy from "rollup-plugin-copy"
import postcss from "rollup-plugin-postcss"
import cssImport from "postcss-import"
import autoprefixer from "autoprefixer"
import cssnanoPlugin from "cssnano"

function componentStyleResolver(componentName) {
    return postcss({
        include: [`frontend/styles/components/${componentName}.css`],
        extract: `chunks/${componentName}.min.css`,
        plugins: [
            cssImport(),
            autoprefixer(),
            cssnanoPlugin(),
        ],
    })
}

function cssEntryFactory(filename) {
    return {
        input: `frontend/styles/standalone-entry/${filename}.css`,
        output: {
            file: `dist/${filename}.min.css`,
        },
        plugins: [
            postcss({
                extract: true,
            }),
        ],
    }
}

export default [
    {
        input: {
            main: "frontend/index.js",
            module: "frontend/scripts/importers/charts/echarts.js",
        },
        output: {
            dir: "template/dist/",
            format: "es",
            entryFileNames: (chunk) => {
                const extname = path.extname(chunk.facadeModuleId)
                const originalName = path.basename(chunk.facadeModuleId, extname)
                return `${originalName}.min.js`
            },
            chunkFileNames: "chunks/[name].min.js",
            sourcemap: true,
        },
        external: [
            /\/builder\//,
            /build\.config\.js/,
            /libs\/katex/,
            /libs\/highlight/,
            /libs\/echarts/,
            /libs\/flowchart/,
            /libs\/sequence-diagram/,
            /libs\/frappe-gantt/,
            /libs\/railroad-diagrams/,
            /libs\/qrcode-svg/,
            /libs\/flexsearch/,
            /libs\/resolve-pathname/,
        ],
        plugins: [
            terser(),
            copy({
                copyOnce: true,
                targets: [
                    { /* images */
                        src: [
                            "frontend/imgs/*.svg",
                            "frontend/imgs/*.jpg",
                            "frontend/imgs/*.jpeg",
                            "frontend/imgs/*.png",
                            "frontend/imgs/*.webp",
                        ],
                        dest: "template/dist/imgs/"
                    },
                    { /* katex script */
                        src: [
                            "frontend/libs/katex/*.min.*",
                            "frontend/libs/katex/katex.map"
                        ],
                        dest: "template/dist/libs/katex/"
                    },
                    { /* katex fonts */
                        src: "frontend/libs/katex/fonts/*",
                        dest: "template/dist/libs/katex/fonts/",
                    },
                    { /* highlight.js */
                        src: [
                            "frontend/libs/highlight-es/highlight.min.js",
                            "frontend/libs/highlight-es/highlight.map",
                            "frontend/libs/highlight-es/github-dark.css"
                        ],
                        dest: "template/dist/libs/highlight-es/"
                    },
                    { /* highlight.js languages */
                        src: [
                            "frontend/libs/highlight-es/languages",
                            "frontend/libs/highlight-es/libs"
                        ],
                        dest: "template/dist/libs/highlight-es/"
                    },
                    { /* echarts.js */
                        src: "frontend/libs/echarts/core.js",
                        dest: "template/dist/libs/echarts/"
                    },
                    { /* echarts.js chunks */
                        src: "frontend/libs/echarts/chunks/*",
                        dest: "template/dist/libs/echarts/chunks"
                    },
                    { /* flowchart.js */
                        src: [
                            "frontend/libs/flowchart.js/*.min.js",
                            "frontend/libs/flowchart.js/*.map"
                        ],
                        dest: "template/dist/libs/flowchart.js/"
                    },
                    { /* sequence-diagram */
                        src: "frontend/libs/sequence-diagram/sequence-diagram-web.mjs",
                        dest: "template/dist/libs/sequence-diagram/"
                    },
                    { /* frappe-gantt */
                        src: "frontend/libs/frappe-gantt/*.min.*",
                        dest: "template/dist/libs/frappe-gantt/"
                    },
                    { /* railroad-diagrams */
                        src: [
                            "frontend/libs/railroad-diagrams/railroad.min.js",
                            "frontend/libs/railroad-diagrams/railroad.css",
                        ],
                        dest: "template/dist/libs/railroad-diagrams/"
                    },
                    { /* qrcode-svg */
                        src: "frontend/libs/qrcode-svg/qrcode.min.js",
                        dest: "template/dist/libs/qrcode-svg/"
                    },
                    { /* flexsearch */
                        src: "frontend/libs/flexsearch/flexsearch.bundle.module.min.js",
                        dest: "template/dist/libs/flexsearch/"
                    },
                    { /* resolve-pathname */
                        src: "frontend/libs/resolve-pathname/index.js",
                        dest: "template/dist/libs/resolve-pathname/"
                    },
                ],
            }),
            componentStyleResolver("fab"),
            componentStyleResolver("searchBox"),
            componentStyleResolver("catalog"),
            componentStyleResolver("skeleton"),
            postcss({
                include: [
                    "frontend/styles/*.css",
                    "frontend/libs/highlight-es/*.css",
                    "frontend/styles/components/paging.css",
                    "!frontend/styles/standalone-entry/**",
                ],
                extract: "style.min.css",
                plugins: [
                    cssImport(),
                    autoprefixer(),
                    cssnanoPlugin(),
                ],
            }),
            dynamicImportVariables(),
        ]
    },
    {
        input: "frontend/sw.js",
        output: {
            file: "template/sw.js",
            format: "es",
            sourcemap: "hidden",
            sourcemapFileNames: "dist/sw.js.map",
        },
        plugins: [
            terser(),
            {   // customized plugin
                name: "sourcemap-path appender",
                renderChunk(code) {
                    const sourcemapPath = "./dist/sw.js.map"
                    code += "\n//# sourceMappingURL=" + sourcemapPath
                    return { code, map: null }
                }
            }
        ]
    },
    cssEntryFactory("ssr-list"),
    cssEntryFactory("noscript"),
]
