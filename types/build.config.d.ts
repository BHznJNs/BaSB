import { OptionalComponentConfig } from "./optionalComponentConfig"

interface PreviewConfig {
    /**
     * - Port for the preview server.
     * - 预览服务器端口。
     */
    port: number

    /**
     * - Port for MCP server
     * - MCP 服务器端口。
     */
    mcpPort: number

    /**
     * - Set `true` to enable auto refresh for the preview server.
     * - 设为 `true` 以为预览服务器启用自动刷新。
     */
    liveReload: boolean
}

interface FABConfig extends OptionalComponentConfig {
    /**
     * - Enable or disable FAB buttons.
     * - 启用或禁用浮动操作按钮。
     */
    enable: boolean

    /**
     * - Defines the order of FAB buttons. Remove any unwanted buttons.
     * - 定义浮动按钮的顺序。也可移除不需要的浮动按钮。
     */
    buttons: ("catalogSwitcher" | "downsizeText" | "enlargeText" | "backToParent" | "backToTop")[]
}

interface CatalogConfig extends OptionalComponentConfig {
    /**
     * - Enable or disable the catalog feature.
     * - 启用或禁用文章目录功能。
     */
    enable: boolean
}

interface RSSConfig extends OptionalComponentConfig {
    /**
     * - Enable or disable the RSS feature.
     * - 启用或禁用 RSS 功能。
     */
    enable: boolean

    /**
     * - Number of items in the RSS feed.
     * - RSS 文件中的博文数量。
     */
    size: number

    /**
     * - Extra customized metadata for the RSS feed.
     * - RSS 文件的额外的自定义头数据。
     */
    extraMetadata?: string
}

interface NewestConfig extends OptionalComponentConfig {
    /**
     * - Enable or disable the newest articles feature.
     * - 启用或禁用最新博文功能。
     */
    enable: boolean

    /**
     * - The page size for the newest pages, is the global `pageSize` as default.
     * - 最新博文页面的单页文章数量，默认使用全局的 `pageSize`。
     */
    pageSize: number
}

interface SearchConfig extends OptionalComponentConfig {
    /**
     * - Enable or disable the search feature.
     * - 启用或禁用搜索功能。
     */
    enable: boolean

    /**
     * - Set the paging threshold for the search index, larger to set less page and slower index loading.
     * - 用来设置搜索索引的分页阈值，越大分页越少且索引加载越慢。
     */
    pageThreshold?: number
}

interface Metadata {
    name?: string
    content?: string
    property?: string
}

/**
 * - Options for `katex.render` and `katex.renderToString`.
 * - KaTeX 渲染的配置。
 * @see https://katex.org/docs/options
 */
interface KatexOptions {
    /**
     * If `true` the math will be rendered in display mode.
     * If `false` the math will be rendered in inline mode.
     * @see https://katex.org/docs/options
     * 
     * @default false
     */
    displayMode?: boolean
    /**
     * Determines the markup language of the output. The valid choices are:
     * - `html`: Outputs KaTeX in HTML only.
     * - `mathml`: Outputs KaTeX in MathML only.
     * - `htmlAndMathml`: Outputs HTML for visual rendering and includes MathML
     * for accessibility.
     * 
     * @default "htmlAndMathml"
     */
    output?: "html" | "mathml" | "htmlAndMathml"
    /**
     * If `true`, display math has `\tag`s rendered on the left instead of the
     * right, like `\usepackage[leqno]{amsmath}` in LaTeX.
     * 
     * @default false
     */
    leqno?: boolean
    /**
     * If `true`, display math renders flush left with a `2em` left margin,
     * like `\documentclass[fleqn]` in LaTeX with the `amsmath` package.
     * 
     * @default false
     */
    fleqn?: boolean
    /**
     * If `true`, KaTeX will throw a `ParseError` when it encounters an
     * unsupported command or invalid LaTeX.
     * If `false`, KaTeX will render unsupported commands as text, and render
     * invalid LaTeX as its source code with hover text giving the error, in
     * the color given by `errorColor`.
     * 
     * @default true
     */
    throwOnError?: boolean
    /**
     * A color string given in the format `"#XXX"` or `"#XXXXXX"`. This option
     * determines the color that unsupported commands and invalid LaTeX are
     * rendered in when `throwOnError` is set to `false`.
     * 
     * @default "#cc0000"
     */
    errorColor?: string
    /**
     * A collection of custom macros.
     * @see https://katex.org/docs/options
     */
    macros?: Record<string, string | object | ((macroExpander:object) => string | object)>
    /**
     * Specifies a minimum thickness, in ems, for fraction lines, `\sqrt` top
     * lines, `{array}` vertical lines, `\hline`, `\hdashline`, `\underline`,
     * `\overline`, and the borders of `\fbox`, `\boxed`, and `\fcolorbox`.
     * The usual value for these items is `0.04`, so for `minRuleThickness`
     * to be effective it should probably take a value slightly above `0.04`,
     * say `0.05` or `0.06`. Negative values will be ignored.
     */
    minRuleThickness?: number
    /**
     * In early versions of both KaTeX (<0.8.0) and MathJax, the `\color`
     * function expected the content to be a function argument, as in
     * `\color{blue}{hello}`. In current KaTeX, `\color` is a switch, as in
     * `\color{blue}` hello. This matches LaTeX behavior. If you want the old
     * `\color` behavior, set option colorIsTextColor to true.
     */
    colorIsTextColor?: boolean
    /**
     * All user-specified sizes, e.g. in `\rule{500em}{500em}`, will be capped
     * to `maxSize` ems. If set to `Infinity` (the default), users can make
     * elements and spaces arbitrarily large.
     * 
     * @default Infinity
     */
    maxSize?: number
    /**
     * Limit the number of macro expansions to the specified number, to prevent
     * e.g. infinite macro loops. `\edef` expansion counts all expanded tokens.
     * If set to `Infinity`, the macro expander will try to fully expand as in
     * LaTeX.
     * 
     * @default 1000
     */
    maxExpand?: number
    /**
     * If `false` or `"ignore"`, allow features that make writing LaTeX
     * convenient but are not actually supported by (Xe)LaTeX
     * (similar to MathJax).
     * If `true` or `"error"` (LaTeX faithfulness mode), throw an error for any
     * such transgressions.
     * If `"warn"` (the default), warn about such behavior via `console.warn`.
     * Provide a custom function `handler(errorCode, errorMsg, token)` to
     * customize behavior depending on the type of transgression (summarized by
     * the string code `errorCode` and detailed in `errorMsg`) this function
     * can also return `"ignore"`, `"error"`, or `"warn"` to use a built-in
     * behavior.
     * @see https://katex.org/docs/options
     * 
     * @default "warn"
     */
    strict?:
        | boolean
        | "ignore" | "warn" | "error"
        | ((errorCode:
              | "unknownSymbol"
              | "unicodeTextInMathMode"
              | "mathVsTextUnits"
              | "commentAtEnd"
              | "htmlExtension"
              | "newLineInDisplayMode",
            errorMsg: string,
            token: Token,
          ) => boolean | "error" | "warn" | "ignore" | undefined)

    /**
     * Run KaTeX code in the global group. As a consequence, macros defined at
     * the top level by `\def` and `\newcommand` are added to the macros
     * argument and can be used in subsequent render calls. In LaTeX,
     * constructs such as `\begin{equation}` and `$$` create a local group and
     * prevent definitions other than `\gdef` from becoming visible outside of
     * those blocks, so this is KaTeX's default behavior.
     * 
     * @default false
     */
    globalGroup?: boolean
}

/**
 * - Global options for flowchart rendering.
 * - 流程图渲染的全局配置。
 * @see https://flowchart.js.org/
 */
interface FlowchartSVGOptions {
    x: number;
    y: number;
    "line-width": number;
    "line-length": number;
    "text-margin": number;
    "font-size": number;
    "font-color": string;
    "line-color": string;
    "element-color": string;
    fill: string;
    roundness?: number;
    "yes-text": string;
    "no-text": string;
    "arrow-end": string;
    scale: number;
    class: string;
    [props: string]: any;
}
interface FlowchartDrawOptions extends Partial<FlowchartSVGOptions> {
    /** Stymbol Styles */
    symbols?: Record<string, Partial<FlowchartSVGOptions>>;
    /** FlowState config */
    flowstate?: Record<string, Partial<FlowchartSVGOptions>>;
}

/**
 * - Global options for Gantt chart rendering.
 * - 甘特图渲染的全局配置。
 * @see https://github.com/frappe/gantt
 */
interface GanttOptions {
    header_height: number,
    column_width: number,
    step: number,
    view_modes: "Quarter Day" | "Half Day" | "Day" | "Week" | "Month",
    bar_height: number,
    bar_corner_radius: number,
    arrow_curve: number,
    padding: number,
    view_mode: "Day" | "Week" | "Month" | "Year",
    date_format: string,

    /**
     * "es", "it", "ru", "ptBr", "fr", "tr", "zh", "de", "hu"
     * - The languages property here will be the same with upper `language` as default
     * - 这里的 languages 属性默认会与前文中指定的 `language` 相同
     */
    language: "en",
}

/**
 * - Global options for railroad diagram rendering.
 * - 铁路图渲染的全局配置。
 * @see https://github.com/tabatkins/railroad-diagrams/blob/gh-pages/README-js.md
 */
interface RailroadOptions {
    /**
     * the minimum amount of vertical separation between two items
     */
    verticalGap: 8
    /**
     * the radius of the arcs
     */
    arcRadius: 10

    /**
     * when some branches of a container are narrower than others, this determines how they're aligned in the extra space.
    */
    internalAlignment: "center" | "left" | "right"

    /**
     * the approximate width of characters in normal text, ignored for text diagrams
     */
    charWidth: number

    /**
     * the approximate width of character in Comment text
     */
    commentCharWidth: number, 
}

/**
 * - Global options for QR code rendering.
 * - 二维码渲染的全局配置。
 * @see https://github.com/papnkukn/qrcode-svg
 */
interface QRCodeOptions {
    /**
     * - Default content for all qrcodes
     * - 对于所有二维码的默认内容
     */
    content: string
    /**
     * - White space padding, 4 modules by default, 0 for no border
     */
    padding: number
    /**
     * - QR Code width in pixels
     */
    width: number
    /**
     * - QR Code height in pixels
     */
    height: number
}

/**
 * - Global options for ECharts rendering.
 * - ECharts 渲染的全局配置。
 * @see https://echarts.apache.org/zh/option.html
 */
type EChartsOptions = Record<string, any>

export interface SiteConfig {
    /**
     * - The URL that this site is deployed on, used for SSR.
     * - 此站点部署的 URL，用于服务端渲染。
     */
    homepage: string

    /**
     * - The title of the blog HTML document, shown in the browser tab.
     * - 博客 HTML 文档的标题，会显示在浏览器的标签栏。
     */
    title: string

    /**
     * - The site description, required for RSS.
     * - 网站的描述，对于 RSS 功能是必要的。
     */
    description: string

    /**
     * - Footer text for the site.
     * - 站点脚注。
     */
    footer?: string

    /**
     * - Language of the site. 网站语言。
     * - "zh" for Simplified Chinese (简体中文)
     * - "en" for English (英文)。
     */
    language: "zh" | "en"

    /**
     * - Number of items per page.
     * - 每页展示的博文数。
     */
    pageSize: number

    /**
     * - Additional JavaScript scripts for the page.
     * - 页面加载的额外 JavaScript 脚本。
     */
    extraScripts?: string[]

    /**
     * - Additional customized metadata scripts for the page.
     * - 页面上额外的自定义元数据。
     */
    extraMetadata?: Metadata[]

    preview?: PreviewConfig
    fab?: FABConfig
    catalog?: CatalogConfig
    rss?: RSSConfig
    newest?: NewestConfig
    search?: SearchConfig

    katexOptions?: KatexOptions
    flowchartOptions?: FlowchartDrawOptions
    ganttOptions?: Partial<GanttOptions>
    railroadOptions?: Partial<RailroadOptions>
    qrcodeOptions?: Partial<QRCodeOptions>
    echartsOptions?: EChartsOptions
}
