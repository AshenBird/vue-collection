import { build as esbuild, BuildOptions } from "esbuild";
import * as process from "node:process";
import { join as pathJoin } from "node:path";
import { emptyDirSync, ensureDirSync } from "fs-extra";
import { readdirSync } from "node:fs";
import { generatorDeclare } from "@mcswift/tsc";
import { Logger } from "@mcswift/base-utils";
const root = process.cwd();
const distPath = pathJoin(root, "lib");
const sourcePath = pathJoin(root, "src/source");
const baseBuildOption: BuildOptions = {
  bundle: false,
};

const preBuild = () => {
  ensureDirSync(distPath);
  emptyDirSync(distPath);
};
const collect = (path = sourcePath, result: string[] = []) => {
  const dirents = readdirSync(path, { withFileTypes: true });
  for (const dirent of dirents) {
    const p = pathJoin(path, dirent.name);
    if (dirent.isDirectory()) {
      result.push(...collect(p, result));
    } else if (dirent.isFile()) {
      result.push(p);
    }
  }
  return result;
};
const tasksGenerator = () => {
  const formatList = ["cjs", "esm"] as const;
  const result: Promise<unknown>[] = [];
  const entryPoints = collect();
  for (const format of formatList) {
    const outdir = pathJoin(distPath, format);
    ensureDirSync(outdir);
    result.push(
      esbuild({
        ...baseBuildOption,
        outExtension: { ".js": format === "esm" ? ".js" : ".cjs" },
        outdir,
        format,
        entryPoints,
      })
    );
  }
  result.push(
    (async () => {
      ensureDirSync(pathJoin(distPath, "types"));
      return generatorDeclare(
        "./src/source",
        "./lib/types",
        root,
        "tsconfig.build.json"
      );
    })()
  );
  return result;
};
const logger = new Logger(" Build Command ");
export const build = async () => {
  preBuild();
  const tasks = tasksGenerator();
  await Promise.all(tasks);
};
