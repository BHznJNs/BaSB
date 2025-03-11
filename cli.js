#!/usr/bin/env node
import { Command } from "commander"
import { packageMetadata } from "./builder/utils/loadPackageMetadata.js"
import { isValidDirectory } from "./builder/utils/loadConfig.js"
import languageSelector from "./builder/utils/languageSelector.js"

/** @param {string[]} commandScripts */
function commandScriptRunner(...commandScripts) {
    /**
     * @description scripts that should runs in valid directory
     * @type {string[]}
     */
    const scriptBlackList = [
        scripts.preview,
        scripts.upgrade,
        scripts.watch,
        scripts.build,
        scripts.ssr,
        scripts.indexing,
        scripts.count,
        scripts.backup,
        scripts.restore,
    ]
    /** @param {string[]} args */
    return async function(...args) {
        if (!isValidDirectory) {
            for (const script of commandScripts) {
                const isBlockedScript = scriptBlackList.includes(script)
                if (isBlockedScript) {
                    console.error(languageSelector(
                        "不合法的 BaSB 目录。",
                        "Not a valid BaSB directory.",
                    ))
                    return
                }
            }
        }
        const moduleImportTasks = commandScripts.map(script => import(script))
        const modules = await Promise.all(moduleImportTasks)
        const moduleProcessTasks = modules.map(module => module.default(...args))
        await Promise.all(moduleProcessTasks)
    }
}

const program = new Command()
const scripts = {
    create: "./builder/scripts/create.js",
    upgrade: "./builder/scripts/upgrade.js",
    preview: "./builder/scripts/preview.js",
    watch: "./builder/scripts/watch.js",
    build: "./builder/scripts/build.js",
    ssr: "./builder/scripts/ssr/index.js",
    indexing: "./builder/scripts/indexing/index.js",
    count: "./builder/scripts/count/index.js",
    backup: "./builder/scripts/backup.js",
    restore: "./builder/scripts/restore.js",
}

// --- --- --- --- --- ---

program.name("BaSB-cli")
    .version(packageMetadata.version)
    .description(packageMetadata.description)

program.command("create")
    .description(languageSelector("创建 BaSB 项目", "Create BaSB repository"))
    .argument("<name>", languageSelector("项目名称", "Repository name"))
    .action(commandScriptRunner(scripts.create))

program.command("upgrade")
    .description(languageSelector("升级 BaSB 项目", "Upgrade BaSB repository"))
    .action(commandScriptRunner(scripts.upgrade))

program.command("preview")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.preview))

program.command("watch")
    .description(languageSelector("开始监听静态文件夹", "Start to watch static directory"))
    .action(commandScriptRunner(scripts.watch))

program.command("build")
    .description(languageSelector("构建", "Build your blogs"))
    .action(commandScriptRunner(scripts.indexing, scripts.ssr, scripts.build))

program.command("ssr")
    .description(languageSelector("服务端渲染", "Server side rendering"))
    .action(commandScriptRunner(scripts.ssr))

program.command("indexing")
    .description(languageSelector("构建索引文件", "Build indexing files"))
    .action(commandScriptRunner(scripts.indexing))

program.command("count")
    .description(languageSelector("字数计数", "Count blog words"))
    .action(commandScriptRunner(scripts.count))

program.command("backup")
    .description(languageSelector("备份博客元数据", "Backup blog metadata"))
    .action(commandScriptRunner(scripts.backup))

program.command("restore")
    .description(languageSelector("恢复博客元数据", "Restore blog metadata"))
    .action(commandScriptRunner(scripts.restore))

program.parse(process.argv)
