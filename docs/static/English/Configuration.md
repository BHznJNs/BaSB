# Configuration

PS: Rebuilding this project is necessary to apply modifications to specific items within the config file.

## Homepage

##homepage##

The URL that this project is deployed, it is used to generate blog links in ``rss.xml``. E.g. [https:\/\/bhznjns.github.io/markdown-blog-template/](https://bhznjns.github.io/markdown-blog-template/).

- - -

## Title

##title##

The title of the front view, will be shown in the tabbar of browser.

- - -

## Description

##description##

The description for the site, is necessary for the RSS function.

- - -

## Language

##language##

Value: 
- ``"zh"`` —— Simplified Chinese
- ``"en"`` —— English

The used language in the front UI.

- - -

## Floating Action Button

##enableFab##

Value: true | false

Used to enable / disable the FABs at the right bottom of front view.

##fabOrdering##
Default:
```javascript
[
    "catalogSwitcher",
    "downsizeText",
    "enlargeText",
    "backToParent",
    "backToTop",
]
```

Defined the ordering of FABs, if you do not need one of them, just remove it.

- - -

## Catalog

##enableCatalog##

Value: true | false

Used to enable / disable the article catalog function in the front view.

- - -

## RSS

##enableRSS##

Value: true | false

Used to enable / disable the RSS publishing function.

##RSSCapacity##

Value: number

Defined the count of blogs contained in the ``rss.xml``.

##RSSIgnoredDir##

Value: ``string[]`` (Array of string)

Ignored directories in the ``rss.xml``, should be the subdirectory of ``static/`` (e.g. there is a directory ``ignored`` in the ``static``, to ignore it, just add ``"ignored"`` to this array).

- - -

## Newest

##enableNewest##

Value: true | false

Used to enable / disable the Newest function.

##newestIgnoredDir##

Value: ``string[]`` (Array of string)

Ignored directories in the Newest, usage is the same as ##RSSIgnoredDir##.

- - -

## In-Site Search

##enableSearch##

Value: true | false

Used to enable / disable the In-Site Search function.


##searchPageThreshold##

Value: number

Used to set the paging threshold for the search index, larger to set less page and slower index loading.

- - -

## Page Capacity

##pageCapacity##

Value: number

Defined the shown count of blogs in every page.

- - -

## Port of Preview Server

##previewPort##

Value: number

The default port for preview server.

- - -

## Renderer Library Configuration

##katexOptions##

The configuration for katex.js to render math formulas, see here: [https:\/\/katex.org/docs/options](https://katex.org/docs/options)

##echartsOptions##

The configuration for echarts.js to render charts, see here: [https:\/\/echarts.apache.org/zh/option.html](https://echarts.apache.org/zh/option.html)

##flowchartOptions##

The configuration for flow charts rendering, see here: [https:\/\/flowchart.js.org/](https://flowchart.js.org/)

##ganttOptions##

The configuration for gantt charts rendering, see here: [https:\/\/github.com/frappe/gantt](https://github.com/frappe/gantt)

##railroadOptions##

The configuration for railroad charts rendering, see here: [https:\/\/github.com/tabatkins/railroad-diagrams/blob/gh-pages/README-js.md](https://github.com/tabatkins/railroad-diagrams/blob/gh-pages/README-js.md)

##qrcodeOptions##

The configuration for QRCodes, see here: [https:\/\/github.com/papnkukn/qrcode-svg](https://github.com/papnkukn/qrcode-svg)
