// Runs the portal CLIs (.agents/skills/*/cli/src/cli.ts) on Node when Bun is not installed.
//
// Usage (Node 22.6+, no packages needed):
//   node --experimental-strip-types --disable-warning=ExperimentalWarning \
//     --import ./tools/node_ts_loader.mjs .agents/skills/<portal>/cli/src/cli.ts <args>
//
// Node strips the TypeScript types itself. The CLIs import "./x.js" while the file
// on disk is "./x.ts" (the Bun/TypeScript convention), so this resolve hook retries
// a missing relative ".js" import as ".ts". Nothing else is changed.
import { register } from "node:module"

const hooks = `
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context)
  } catch (err) {
    const relative = specifier.startsWith("./") || specifier.startsWith("../")
    if (err && err.code === "ERR_MODULE_NOT_FOUND" && relative && specifier.endsWith(".js")) {
      return next(specifier.slice(0, -3) + ".ts", context)
    }
    throw err
  }
}
`

register("data:text/javascript," + encodeURIComponent(hooks), import.meta.url)
