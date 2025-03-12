/** @type {import("basb-cli/types").SiteConfig} */
export default {
    homepage: "https://www.example.com/",
    title: "Blog as Second Brain",
    description: "Blog as Second Brain",
    language: "en",
    pageSize: 20,

    preview: {
        port: 3030,
        liveReload: true,
    },

    catalog: {
        enable: true
    },
    fab: {
        enable: true,
        buttons: [
            "catalogSwitcher",
            "downsizeText",
            "enlargeText",
            "backToParent",
            "backToTop",
        ],
    },
    rss: {
        enable: true,
        size: 50,
    },
    newest: {
        enable: true,
        pageSize: 40,
    },
    search: {
        enable: true,
        pageThreshold: 30000
    },

    echartsOptions: {
        tooltip: {
            show: true,
            backgroundColor: "rgb(255,255,255,.9)"
        }
    },

    qrcodeOptions: {
        width: 256,
        height: 256,
    }
}
