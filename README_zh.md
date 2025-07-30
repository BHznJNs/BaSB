<div align="center">
    <br />
    <img src="./common/favicon/original.jpg" alt="BaSB Logo" width="200" height="200" />
    <h1>博脑</h1>
    <a href="README.md">English</a> |
    <a href="https://bhznjns.github.io/BaSB/">文档</a> | 
    <a href="https://github.com/BHznJNs/BaSB/issues">问题反馈</a>
    <br />
    <br />
</div>

是**博**客，也是第二大**脑**！

## 开始使用

```shell
npm install basb-cli -g
```

在安装完成后：

```shell
basb-cli create [博客名称]
cd [博客名称]
npm link basb-cli
```

使用 `basb-cli` 的子命令启用预览服务器：

```shell
basb-cli build
basb-cli preview
```

## MCP 服务器

本命令行工具内置了一个 MCP 服务器，可以通过 ``basb-cli mcp [target-endpoint] [server-port]`` 来启动。在使用 ``basb-cli preview`` 时，它也会被启动。

你也可以使用[独立的软件包](https://github.com/BHznJNs/BaSB-MCP)或[Cloudflare Worker 版本](https://github.com/BHznJNs/BaSB-MCP-Worker)！

## VSCode 拓展

1. [官方增强拓展](https://marketplace.visualstudio.com/items?itemName=BHznJNs.basb-ext)
2. 在中日韩字符与英文混写的场景下的[格式纠正工具](https://marketplace.visualstudio.com/items?itemName=huacnlee.autocorrect)
3. [Draw.io 的官方 VSCode 拓展](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio)