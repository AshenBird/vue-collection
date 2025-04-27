import {
  computed,
  defineComponent,
  toValue,
  type CSSProperties,
  type ExtractPropTypes,
  type PropType,
} from "vue";
import { useThemeVars } from "naive-ui";

const props = {
  direction: {
    required: false,
    type: String as PropType<"horizontal" | "vertical">,
    default: "horizontal",
  },
  color: {
    required: false,
    type: String as PropType<string>,
  },
  size: {
    required: false,
    type: Number as PropType<number>,
    default: 1,
  },
  round: {
    required: false,
    type: Boolean as PropType<boolean>,
    default: false,
  },
} as const;

export type SplitLineProps = ExtractPropTypes<typeof props>;

export const SplitLine = defineComponent<SplitLineProps>(
  (props) => {
    const themeVars = useThemeVars()
    const wrapStyle = computed<CSSProperties>(() => {
      const result: CSSProperties = {
        display: "block",
      };
      if (props.direction === "vertical") {
        result.height = "100%";
      } else {
        result.width = "100%";
      }
      return result;
    });
    const style = computed<CSSProperties>(() => {
      const backgroundColor = props.color
        ? props.color
        : toValue(themeVars.value.primaryColor); //textColor2
      const realSize = props.size;
      const size = realSize >= 1 ? realSize : 1;
      const radio = realSize >= 1 ? 1 : realSize;
      const base: CSSProperties = {
        backgroundColor,
        borderRadius: props.round ? `${size}px` : undefined,
      };
      if (props.direction === "vertical") {
        return {
          ...base,
          height: "100%",
          width: `${size}px`,
          transform:
            radio === 1
              ? undefined
              : `translateX(-${radio * 100}%) scaleX(${radio})`,
        };
      }
      return {
        ...base,
        backgroundColor,
        height: `${size}px`,
        width: "100%",
        transform: radio === 1 ? undefined : ` scaleY(${radio})`,
      };
    });
    return () => (
      <div style={wrapStyle.value}>
        <div style={style.value}></div>
      </div>
    );
  },
  {
    props,
  }
);
