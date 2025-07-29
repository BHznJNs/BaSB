import { packageMetadata }  from "./utils/loadPackageMetadata.js"
export { setTargetEndpoint, mcpServerFactory } from "./scripts/mcp.js"

export const {
    version, description, author, repository, license,
} = packageMetadata
