<div align="center">
    <br />
    <img src="./common/favicon/original.jpg" alt="BaSB Logo" width="200" height="200" />
    <h1>BaSB</h1>
    <a href="README_zh.md">中文介绍</a> | 
    <a href="https://bhznjns.github.io/BaSB/">Documentation</a> | 
    <a href="https://github.com/BHznJNs/BaSB/issues">Feedback</a>
    <br />
    <br />
</div>

**B**log **a**s **S**econd **B**rain!

## Getting Started

```shell
npm install basb-cli -g
```

After installed:

```shell
basb-cli create [blog-name]
cd [blog-name]
npm link basb-cli
```

Use `basb-cli` subcommand to preview:

```shell
basb-cli build
basb-cli preview
```

## MCP Server

This CLI program has a build-in MCP server, which can be started by ``basb-cli mcp [target-endpoint] [server-port]``. It will also be started when you use ``basb-cli preview``.

You can also use the [independent package](https://github.com/BHznJNs/BaSB-MCP) or even the [Cloudflare Worker version](https://github.com/BHznJNs/BaSB-MCP-Worker)!

## VSCode Extentions

1. The [official enhancement extension](https://marketplace.visualstudio.com/items?itemName=BHznJNs.basb-ext)
2. The [linter](https://marketplace.visualstudio.com/items?itemName=huacnlee.autocorrect) for scenes where CJK and English are mixed
3. [Draw.io official VSCode extension](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)
