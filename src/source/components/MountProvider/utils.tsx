import { h, type InjectionKey, type FunctionalComponent, type Component} from "vue"
import type { InferProps, InferProviderOption } from "./types"
export const createInjectionKey = <T,>(name?: string)=> {
  return Symbol(name) as InjectionKey<T>
}

export const createHtmlComponent = (tag?:string):FunctionalComponent => {
  return (props,ctx) => {
    if(!tag){
      return <>
        {ctx.slots.default?.()}
      </>
    }
    return h(tag,props,ctx.slots.default?.())
  }
}

// export function defineProvider<T extends Component>(option:InferProviderOption<T>):InferProviderOption<T>
export function defineProvider<T extends Component>(component:T,props?:InferProps<T>):InferProviderOption<T>
export function defineProvider<T extends Component>(arg0:|T,props?:InferProps<T>){
  return {
    component:arg0,
    props
  }
}