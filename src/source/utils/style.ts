import type { CSSProperties } from "vue";
import { hyphenate, normalizeStyle } from "@vue/shared"
export const normalizeStyleText = (style:CSSProperties|string|undefined)=>{
  const raw = normalizeStyle(style)
  if(!raw)return ""
  if(typeof raw)return raw;
  if(typeof raw==="string")
  return Object.entries(raw).reduce((result,[name,val])=>{
    result.push(`${hyphenate(name)}: ${val};`)
    return result
  },[] as string[]).join('\n');
}