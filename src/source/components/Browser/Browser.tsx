import { computed, defineComponent, useTemplateRef, type ExtractPropTypes, type PropType } from "vue";
import type { GeneralHttpUrl } from "../../types";

const props = {
  src:{
    required:false,
    type:String as PropType<GeneralHttpUrl>
  },
  width:{
    required:false,
    type:[String,Number ]as PropType<string | number>
  },
  height:{
    required:false,
    type:[String,Number ] as PropType<string | number>
  },
} as const

export type BrowserProps = ExtractPropTypes<typeof props>

export const Browser = defineComponent({
  props,
  setup(props){
    const sizeHandle = (val?:number|string)=>{
      if(typeof val === "number"){
        return `${val}px`
      }
      return val
    }
    const containerStyle = computed(() => {
      const width = sizeHandle(props.width) || '100%'
      const height = sizeHandle(props.height) || '100%'
      return {
        width,
        height,
        border:0,
        display:"block",
      }
    })
    const el = useTemplateRef('iframe')
    return {
      el,
      containerStyle,
      src:props.src
    }
  },
  render(){
    const { containerStyle,src } = this

    return <iframe ref="iframe" style={containerStyle} src={src}  ></iframe>
  }
})