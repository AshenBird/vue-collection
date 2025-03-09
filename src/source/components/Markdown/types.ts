import type { CSSProperties } from "vue"

export type MarkdownTheme = {
  styles:{
    [ x in keyof HTMLElementTagNameMap ]?:CSSProperties|string|undefined
  }
}

export type MarkdownOptions = {
  theme:MarkdownTheme
}