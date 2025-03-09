import { defineComponent, type ExtractPropTypes, type PropType } from "vue";
import type { MarkdownOptions } from "./types";
import { Markdown } from "./Markdown";

const props = {
  content:{
    type:String as PropType<string>,
    required:true,
  },
  className:{
    
    type:String as PropType<string>,
    required:false,
  }
} as const 

export type CustomMarkdownProps = ExtractPropTypes<typeof props>

export const defineMarkdownComponent = (
  options:MarkdownOptions
)=>{
  const { theme } = options
  return defineComponent<CustomMarkdownProps>((props)=>{
      return ()=><Markdown content={props.content} theme={theme} className={props.className} ></Markdown>
 
  },{props})
}