<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import { computed, toValue, type CSSProperties } from "vue";
const props = withDefaults(
  defineProps<{
    size?: number;
    type?: "default" | "primary" | "info" | "success" | "warning" | "error";
  }>(),
  {
    size: 6,
    type: "default",
  }
);
const themeVars = useThemeVars();
const colorKey = {
  default:"textColor2",
  primary: "primaryColor",
  info: "infoColor",
  success: "successColor",
  warning: "warningColor",
  error: "errorColor",
} as const;
const wrapStyle:CSSProperties = {
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
}
const style = computed<CSSProperties>(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: "50%",
  backgroundColor: toValue(themeVars.value[colorKey[props.type]]),
}));
</script>
<template>
  <div :style="wrapStyle" >
    <div :style="style"></div>
  </div>
</template>
