#!/usr/bin/env node
import { Command } from "commander"
import languageSelector from "./builder/utils/languageSelector.js"

function commandScriptRunner(...scripts) {
    return () => Promise.all(
        scripts.map(script => import(script)))
}

const program = new Command()
const scripts = {
    preview: "./builder/scripts/preview.js",
    watch: "./builder/scripts/watch.js",
    build: "./builder/scripts/build.js",
    ssr: "./builder/scripts/ssr/index.js",
    indexing: "./builder/scripts/indexing/index.js",
    count: "./builder/scripts/count/index.js",
    backup: "./builder/scripts/backup.js",
    restore: "./builder/scripts/restore.js",
}

program.name("BaSB-cli")

program.command("preview")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.preview))

program.command("watch")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.watch))

program.command("build")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.indexing, scripts.ssr, scripts.build))

program.command("ssr")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.ssr))

program.command("indexing")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.indexing))

program.command("count")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.count))

program.command("backup")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.backup))

program.command("restore")
    .description(languageSelector("启动预览服务器", "Launch preview server"))
    .action(commandScriptRunner(scripts.restore))

program.parse()
