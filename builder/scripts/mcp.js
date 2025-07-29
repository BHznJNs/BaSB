import express from "express"
import cors from "cors"
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import { pathToIndexFilename } from "../utils/path.js"

const app = express()
const mcpGlobalStates = {
    targetEndpoint: null,
}

app.use(express.json())
app.use(cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id"],
    allowedHeaders: ["Content-Type", "mcp-session-id"],
}))

function notAllowedHandler(_req, res) {
    console.log('Received DELETE MCP request')
    res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
            code: -32000,
            message: "Method not allowed."
        },
        id: null
    }))
}
app.get("/mcp", notAllowedHandler)
app.delete("/mcp", notAllowedHandler)

// --- --- --- --- --- ---

const MCP_SERVER_INTRODUCTION = `\
This is the MCP server for a BaSB workspace. The BaSB is short for "Blog as Second Brain",\
which is a personal knowledge management system.

You can use this MCP server to access the directories and articles in the BaSB workspace.\
`

const ARTICLE_RESOURCE_INSTRUCTION = `\
This resource template is used to get the content of an article specified by the path.
The returned value is the content of target article in Markdown format.\
`

const DIRECTORY_RESOURCE_INSTRUCTION = `\
This resource template is used to get data for a directory specified by the path.
The data includes the articles in the directory, the subdirectories, and the description of the target directory.

If the path is "root", the root directory of the BaSB workspace will be used.

The returned value is a JSON object with the following structure:
\`\`\`
{
  "total": number,              // Total number of pages
  "current": number,            // Current page number
  "content": [                  // Content list
    {
      "name": string,           // Name (folders end with /, files end with .md)
      "createTime": number,     // Creation timestamp
      "modifyTime": number      // Modification timestamp
    },
    // ... more content items
  ],
  "createTime": number,         // Directory creation timestamp
  "updateTime": number,         // Directory update timestamp
  "isReversed": boolean,        // Whether the order is reversed
  "dirDescription": string      // Directory description (Markdown format)
}
\`\`\``

const NEWEST_RESOURCE_INSTRUCTION = `\
This resource template is used to get the newest articles in the BaSB workspace.
The returned value is a JSON object with the following structure:
\`\`\`
{
  "total": number,              // Total number of pages
  "current": number,            // Current page number
  "content": [                  // Content list
    {
      "title": string,          // Article title
      "link": string,           // Relative path to the article
      "createTime": number      // Creation timestamp
    },
    // ... more content items
  ]
}
\`\`\``

function mcpServerFactory() {
    /**
     * @param {string | string[]} path 
     * @returns {Promise<string>} The target article content in Markdown format
     */
    async function articleHandler(path /** @type {string} */) {
        const targetResourceUrl = new URL("static/" + path, mcpGlobalStates.targetEndpoint)
        const response = await fetch(targetResourceUrl)
        return await response.text()
    }

    /**
     * @param {string | string[]} page 
     * @returns {Promise<object>}
     */
    async function newestContentHandler(page) {
        const resolvedPath = "newest_" + page
        const targetResourceUrl = new URL(`.index/${resolvedPath}`, mcpGlobalStates.targetEndpoint)
        const response = await fetch(targetResourceUrl)
        return await response.json()
    }

    /**
     * @param {string | string[]} path 
     * @param {string | string[]} page 
     * @returns {Promise<object>}
     */
    async function directoryHandler(path, page) {
        path = path === "root"
            ? "static"
            : "static/" + path
        const resolvedPath = pathToIndexFilename(path, page)
        const targetResourceUrl = new URL(`.index/${resolvedPath}`, mcpGlobalStates.targetEndpoint)
        const response = await fetch(targetResourceUrl)
        return await response.json()
    }

    const server = new McpServer({
        name: "BaSB-MCP",
        version: "1.0.0",
    }, {
        instructions: MCP_SERVER_INTRODUCTION
    })

    server.registerResource(
        "article",
        new ResourceTemplate("article://{+path}", { list: undefined }),
        {
            title: "Article Content",
            description: ARTICLE_RESOURCE_INSTRUCTION
        },
        async (uri, { path }) => {
            const result = await articleHandler(path)
            return {
                contents: [{
                    uri: uri.href,
                    text: result,
                    mimeType: "text/markdown",
                }]
            }
        }
    )

    server.registerResource(
        "newest",
        new ResourceTemplate("newest://?page={page}", { list: undefined }),
        {
            title: "Newest Content",
            description: NEWEST_RESOURCE_INSTRUCTION,
        },
        async (uri, { page }) => {
            const result = await newestContentHandler(page)
            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify(result),
                    mimeType: "application/json",
                }]
            }
        }
    )

    server.registerResource(
        "directory",
        new ResourceTemplate("directory://{path}/?page={page}", { list: undefined }),
        {
            title: "Directory Content",
            description: DIRECTORY_RESOURCE_INSTRUCTION,
        },
        async (uri, { path, page }) => {
            const result = await directoryHandler(path, page)
            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify(result),
                    mimeType: "application/json",
                }]
            }
        }
    )

    return server
}

app.post("/mcp", async (req, res) => {
    const server = mcpServerFactory()
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,  
    })

    res.on("close", () => {
        transport.close()
        server.close()
    })

    try {
        await server.connect(transport)
        await transport.handleRequest(req, res, req.body)
    } catch(e) {
        console.error("Error handling MCP request:", e)
        if (res.headersSent) return
        res.status(500).json({
            jsonrpc: "2.0",
            error: {
            code: -32603,
                message: "Internal server error",
            },
            id: null,
        })
    }
})

/**
 * @param {string} targetEndpoint_
 * @param {number} port
 */
export default function mcpMain(targetEndpoint_, port) {
    mcpGlobalStates.targetEndpoint = targetEndpoint_
    app.listen(port, "0.0.0.0", () => {
        console.log(`MCP server listening on 0.0.0.0:${port}`)
    })
}
