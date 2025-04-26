<script setup lang="ts">
import { computed, toValue, type CSSProperties } from 'vue';
import { useThemeVars, } from 'naive-ui';
const themeVars = useThemeVars()
const props = withDefaults(defineProps<{
  direction?: "horizontal" | "vertical"
  color?:string
  size?:number
  round?:boolean
}>(),{
  direction:"horizontal",
  size:1,
  round:false,
})
const wrapStyle= computed<CSSProperties>(()=>{
  const result:CSSProperties = {
    display:"block"
  }
  if (props.direction === "vertical") {
    result.height = "100%"
  }else{
    result.width = "100%"
  }
  return result
})
const style = computed<CSSProperties>(()=>{
  const backgroundColor = props.color?props.color:toValue(themeVars.value.primaryColor)//textColor2
  const realSize= props.size
  const size = realSize>=1?realSize:1
  const radio = realSize>=1?1:realSize;
  const base:CSSProperties = {
    backgroundColor,
    borderRadius:props.round?`${size}px`:undefined,
  }
  if (props.direction === "vertical") {
    return {
      ...base,
      height: "100%",
      width: `${size}px`,
      transform:radio===1?undefined:`translateX(-${radio * 100}%) scaleX(${radio})`,
    }
  }
  return {
    ...base,
    backgroundColor,
    height: `${size}px`,
    width: "100%",
    transform: radio===1?undefined:` scaleY(${radio})`,
  }
})
</script>
<template>
  <div :style="wrapStyle">
    <div :style="style" ></div>
  </div>
</template>