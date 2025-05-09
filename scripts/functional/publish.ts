
import { resolveCliOption } from "@mcswift/cli"
import Meta from "../../meta.json";
import { Logger } from "@mcswift/base-utils";
import { build } from "./build";
import { NpmPackage } from "@mcswift/npm";
import{ spawnSync }from "node:child_process"
// import Git from "simple-git"
const logger = new Logger(" Publish Command ")
const root = process.cwd();
const tidy = async (level:"fix"|"opt"|"feature"|"break"|"feat") => {
  const pack = new NpmPackage(root);
  const info = JSON.parse(JSON.stringify(pack.getPackageInfo()));
  // @ts-ignore
  pack.setPackageInfo("exports",Object.fromEntries(
    Object.entries(
      Meta
    ).map(([name, _entry]) => {
      const prefix = "./lib"
      const getPath = (type:"esm"|"cjs"|"types",entry:string)=>`${prefix}/${type}/${entry}.${{
        esm:"js",
        cjs:"cjs",
        types:"d.ts"
      }[type]}`
      return [
        name,
        {
          import: getPath( "esm", _entry),
          // require: getPath( "cjs", _entry),
          types: getPath( "types", _entry),
        },
      ];
    })
  ));
  // @ts-ignore
  pack.setPackageInfo("types","lib/types/index.d.ts")
  pack.setPackageInfo("type","module")
  pack.setPackageInfo("main","lib/es/index.js")
  pack.setPackageInfo("files",[
    "lib",
  ])
  let [major,minor,patch] = (info.version as string).split('.')
  if(["fix","opt"].includes(level)){
    patch= (parseInt(patch)+1).toString()
  }else if (level==="feature"||level==="feat"){
    minor=(parseInt(minor)+1).toString()
    patch='0'
  }else{
    major=(parseInt(major)+1).toString()
    minor='0'
    patch='0'
  }
  const version = [major,minor,patch].join('.')
  pack.setPackageInfo("version",version)
  return version
};
const checkGit = ()=>{
  const child = spawnSync("git",[
    "status", "--porcelain"
  ],{
    encoding:"utf-8"
  })
  const records = child.stdout.split("\n").filter(item=>!!item).map(item=>item.trim().split(" "));
  if(records.some(([flag])=>["??","M"].includes(flag))){
    return false
  }
  return true
}
const fixVersion = async (version:string)=>{
  const message = `publish v${version}`
  spawnSync("git",['commit','-a',"--message",message,],{
    stdio:['inherit','inherit','inherit']
  })
  spawnSync("git",['tag',`v${version}`,],{
    stdio:['inherit','inherit','inherit']
  })
  logger.info("commit finish")
}
export const publish = async ()=>{
  /*---------------------- */
  /* 获取并整理参数 */
  const [ _nodePath, _scriptPath, ...args ] = process.argv;
  const options = resolveCliOption(args);
  const updateLevel =  options.level as "fix"|"opt"|"feature"|"break"|"feat"| undefined
  // const tag =  options.tag as "alpha"|"beta"|"rc"|undefined
  if(!updateLevel){
    logger.error(`Can't find "level" param, "level" can be "fix"|"opt"|"feature"|"break"|"feat".`)
    process.exit(0)
    return
  }
  const levelValues = ["fix","opt","feature","break","feat"]
  if(!levelValues.includes(updateLevel)){
    logger.error(`Illegal level value "${updateLevel}", "level" can be "fix"|"opt"|"feature"|"break"|"feat".`)
    process.exit(0)
    return
  }
  // check
  if(!checkGit()){
    logger.error(`Some files have not commit. Please commit first.`)
    process.exit(0)
    return
  }
  // 构建一下
  await build()
  // 更新包信息
  const version = await tidy(updateLevel)
  await fixVersion(version)

  // 发布
  spawnSync("pnpm",["publish","--access","public","--tag","latest"],{
    stdio:['inherit','inherit','inherit'],
    cwd:root
  })
}