export const readmeFilename  = ["README.md", "readme.md", "读我.md"]
export const reverseFilename = ["rev", "倒序"]

export const orderByCreateTime = ["orderby-create-time", "按创建时间排序"]
export const orderByModifyTime = ["orderby-modify-time", "按修改时间排序"]
export const orderByFilename = ["orderby-filename", "按文件名排序"]
export const orderBy = [...orderByCreateTime, ...orderByModifyTime, ...orderByFilename]

export const ignoredByNewests = ["newests-ignored", "最新博文中排除"]
export const ignoredByRSS = ["rss-ignored", "RSS 中排除"]
export const ignoredBySearch = ["search-ignored", "搜索中排除"]
export const ignoredByCounter = ["counter-ignored", "统计信息中排除"]
export const ignoredBy = [...ignoredByNewests, ...ignoredByRSS, ...ignoredBySearch, ...ignoredByCounter]
