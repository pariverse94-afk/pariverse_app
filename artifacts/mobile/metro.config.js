const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// pnpm monorepo: let Metro resolve packages from the workspace root
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// During pnpm install, some packages (grpc-js, drizzle-orm, etc.) generate
// code into _tmp_N subdirectories that are immediately deleted. Metro tries
// to watch them and throws ENOENT. Block any path that contains such a dir.
const existing = config.resolver.blockList ?? [];
config.resolver.blockList = [
  ...(Array.isArray(existing) ? existing : [existing]),
  // Matches: …/node_modules/<pkg-name>_tmp_<digits>/…
  /node_modules[/\\][^/\\]*_tmp_\d+[/\\]/,
];

module.exports = config;
