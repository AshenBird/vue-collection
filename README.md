# @mcswift/vue-collection

## Install

```shell
# use pnpm
pnpm add @mcswift/vue-collection

# use npm
npm i @mcswift/vue-collection --save

# use yarn
yarn i @mcswift/vue-collection

```

Only `pnpm` has been test.

## Usage

### Components

#### Markdown

A component for render markdown content

```tsx
import { ref } from "vue"
import { Markdown } from "@mcswift/vue-collection"
// or 
import { Markdown } from "@mcswift/vue-collection/markdown"
const DemoView = defineComponent(()=>{
  const content = ref(`# title ...`) // markdown string
  const className = "my-markdown"
  const aStyle = {
    color:"#fff"
  } // or color:#fff
  return  (
    <Markdown
      content={content.value}
      className={className}
      aStyle={aStyle}
    >
    </Markdown>
  )
})
```

#### Browser

A component for render iframe

```tsx
import { ref } from "vue"
import { Browser } from "@mcswift/vue-collection"
// or 
import { Browser } from "@mcswift/vue-collection/browser"
const DemoView = defineComponent(()=>{
  const src = ref(`https://mcswift.me`)
  const width = ref<number|string>("1200px")
  const height = ref<number|string>("800px")
  return  (
    <Browser
      src={src.value}
      width={width.value}
      height={height.value}
    >
    </Browser>
  )
})
```

#### ECharts

A component for render ECharts

```tsx
import { ref } from "vue"
import type { EChartsOption } from "echarts"

import { ECharts } from "@mcswift/vue-collection"
// or 
import { ECharts } from "@mcswift/vue-collection/echarts"
const DemoView = defineComponent(()=>{
  const options = ref<EChartsOption>({})
  const width = ref<number|string>("1200px")
  const height = ref<number|string>("800px")
  return  (
    <ECharts
      options={options.value}
      width={width.value}
      height={height.value}
    >
    </ECharts>
  )
})
```

#### MountProvider

A component for insert Provider component and provide hooks for render something by function style.

```tsx
// top component
import { ref } from "vue"
import { FooProvider, BarProvider } from "some=package"
import { MountProvider, defineProvider } from "@mcswift/vue-collection"
// or 
import { MountProvider, defineProvider } from "@mcswift/vue-collection/mount-provider"
const TopView = defineComponent(()=>{
  // Array order related provider component nest order
  const providers = [
    // defineProvider is help extract props type, I can't find method straight extract type for Record.
    defineProvider(FooProvider,{
      // ...props
    }),
    defineProvider(BarProvider,{
      // ...props
    })
  ]
  return  (
    <MountProvider
      providers={providers}
    >
    </MountProvider>
  )
})

// sub component
import { ref } from "vue"
import { useFoo } from "some=package"
import { useMount } from "@mcswift/vue-collection"
// or 
import { useMount } from "@mcswift/vue-collection/mount-provider"
const FarView = defineComponent((props)=>{
  return <div class={props.className} ></div>
},{props:{
  className:{
    type:String
  }
}})
const SubView = defineComponent(()=>{
  const foo = useFoo() // from Foo Provider
  for.doSth()

  const mount = useMount()
  const className = "--sth"
  const mountCtrl =  mount({
    // bla
    content:()=><FarView className={className} ></FarView>
    // or
    component:FarView,
    props:{
      className
    }
  })
  return  (
    <div></div>
  )
})

```

### Utils

#### normalizeStyleText

A function for 'style'  which be accept for component style attribute, transform to string.

```ts
import type { CSSProperties } from "vue"

export function normalizeStyleText(style: CSSProperties|string|undefined):string
```

