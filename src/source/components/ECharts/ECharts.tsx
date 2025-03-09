import { init as echartInit, type ECharts, type EChartsOption } from "echarts";
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  useTemplateRef,
  type ExtractPropTypes,
  type PropType,
} from "vue";

const props = {
  options: {
    required: true,
    type: Object as PropType<EChartsOption>,
  },
  width: {
    required: false,
    type: [String, Number] as PropType<string | number>,
  },
  height: {
    required: false,
    type: [String, Number] as PropType<string | number>,
  },
} as const;

export type EChartsComponentProps = ExtractPropTypes<typeof props>;

export const EChartsComponent = defineComponent<EChartsComponentProps>((props,ctx)=>{
    const containerRef = useTemplateRef<HTMLElement>("container");
    let _instance: ECharts | null = null;
    onMounted(() => {
      if (!containerRef.value) return null as never;
      const instance = echartInit(containerRef.value);
      _instance = instance;
      instance.setOption(props.options);
      instance.resize();
    });
    onUnmounted(() => {
      _instance?.dispose();
    });
    const sizeHandle = (val?: number | string) => {
      if (typeof val === "number") {
        return `${val}px`;
      }
      return val;
    };
    const containerStyle = computed(() => {
      const width = sizeHandle(props.width) || "100%";
      const height = sizeHandle(props.height) || "100%";
      return {
        width,
        height,
      };
    });

    /*----------------------*/
    /* 对外暴露的句柄 */
    /*----------------------*/
    const getInstance = () => {
      return _instance;
    };
    ctx.expose({
      getInstance
    })
    return ()=>(
      <div
        ref={containerRef}
        class="echarts-container"
        style={containerStyle.value}
      ></div>
    );
  },
  {
    props
  }
);
