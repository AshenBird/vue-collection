import type { PropType, Prop } from "vue";



export type PreExtractPropsType<T extends Record<string, Exclude<Prop<unknown>, PropType<unknown>>>> = {
  [K in keyof T]: Omit<T[K], "default">
}