import { useThemeVars } from "naive-ui";
import { computed, defineComponent, toValue, type CSSProperties, type ExtractPropTypes, type PropType } from "vue";
const props = {
  type: {
    required: false,
    type: String as PropType<"default" | "primary" | "info" | "success" | "warning" | "error">,
    default: "default",
  },
  size: {
    required: false,
    type: Number as PropType<number>,
    default: 6,
  },
} as const;

export type SpotProps = ExtractPropTypes<typeof props>;

export const Spot = defineComponent(
  (props) => {
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
    return ()=>(
      <div style={wrapStyle} >
        <div style={style.value}></div>
      </div>)
  },{
    props
  }
)