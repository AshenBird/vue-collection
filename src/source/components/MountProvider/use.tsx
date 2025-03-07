import { inject } from "vue"
import { MountInjectionKey } from "./constants"
import type { MountApiInjection } from "./types"

export const useMount = ()=>{
  const mount =  inject(MountInjectionKey) as MountApiInjection
  return mount
}