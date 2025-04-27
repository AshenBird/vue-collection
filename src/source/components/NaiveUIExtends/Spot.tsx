import { useThemeVars } from "naive-ui";
import { computed, defineComponent, toValue, type CSSProperties, type ExtractPropTypes, type PropType } from "vue";
const props = {
  type: {
    required: false,
    type: String as PropType<"default" | "primary" | "info" | "success" | "warning" | "error">,
  },
  size: {
    required: false,
    type: Number as PropType<number>,
  },
} as const;

export type SpotProps = ExtractPropTypes<typeof props>;

export const Spot = defineComponent<SpotProps>(
  (props) => {
    const themeVars = useThemeVars();
    const size = computed(()=>props.size||6)
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
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      backgroundColor: toValue(themeVars.value[colorKey[props.type||"default"]]),
    }));
    return ()=>(
      <div style={wrapStyle} >
        <div style={style.value}></div>
      </div>)
  },{
    props
  }
)