import { build as esbuild, BuildOptions } from "esbuild";
import * as process from "node:process";
import { join as pathJoin } from "node:path";
import { emptyDirSync, ensureDirSync } from "fs-extra";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { generatorDeclare } from "@mcswift/tsc";
import { Logger } from "@mcswift/base-utils";
const root = process.cwd();
const distPath = pathJoin(root, "lib");
const sourcePath = pathJoin(root, "src/source");
const baseBuildOption: BuildOptions = {
  bundle: false,
  jsx: "transform",
  jsxFactory: "h",
  jsxFragment: "Fragment",
  logLevel: "error",
};

const preBuild = () => {
  ensureDirSync(distPath);
  emptyDirSync(distPath);
};
const collect = (dir = sourcePath, result: string[] = []) => {
  const dirents = readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const d = pathJoin(dir, dirent.name);
    if (dirent.isDirectory()) {
      collect(d, result);
    } else if (dirent.isFile()) {
      result.push(d);
    }
  }
  return result;
};
const entryPoints = collect();

const formatList = ["cjs", "esm"] as const;
const tasksGenerator = () => {
  const result: Promise<unknown>[] = [];

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

const appendImport = async () => {
  const append = async (path: string) => {
    // console.debug(path)
    const prefix = `import { h,Fragment } from "vue" \n`;
    const content = readFileSync(path, { encoding: "utf-8" });
    const result = prefix + content;
    writeFileSync(path, result, { encoding: "utf-8" });
  };
  const list: string[] = [];
  for (const format of formatList) {
    const outdir = pathJoin(distPath, format);
    const replaced = entryPoints
      .filter((item) => item.endsWith(".tsx"))
      .map((item) => {
        return item
          .replace(sourcePath, outdir)
          .replace(".tsx", format === "esm" ? ".js" : ".cjs");
      });
    list.push(...replaced);
  }
  const tasks: Promise<void>[] = [];

  for (const path of list) {
    tasks.push(append(path));
  }
  await Promise.all(tasks);
};
const logger = new Logger(" Build Command ");
export const build = async () => {
  preBuild();
  const tasks = tasksGenerator();

  await Promise.all(tasks);
  await appendImport();
};
