---
name: Metro _tmp_ blockList
description: Metro crashes on packages that create/delete _tmp_N directories during pnpm install; fix with a blockList regex in metro.config.js
---

## Rule
Any package that generates code from protobufs or native bindings during pnpm install (e.g. `@grpc/grpc-js`, `drizzle-orm`) may create `<pkg>_tmp_<digits>` directories that get deleted immediately. Metro tries to watch them and throws `ENOENT`. Block all such dirs.

## How to apply
In `artifacts/mobile/metro.config.js`, add to `config.resolver.blockList`:

```js
/node_modules[/\\][^/\\]*_tmp_\d+[/\\]/
```

This one regex covers both grpc-js and drizzle-orm variants and any future packages with the same pattern.

**Why:** Metro watches `watchFolders` (the entire workspace root in a monorepo). pnpm's virtual store under `.pnpm/` is inside node_modules, so Metro sees every temp dir created during install by any package — even packages only used by other artifacts in the monorepo (e.g., firebase-admin in api-server).
