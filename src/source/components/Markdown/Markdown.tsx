import { marked } from "marked";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  type CSSProperties,
  type ExtractPropTypes,
  type PropType,
} from "vue";
import { normalizeStyleText } from "../../utils";
import type { MarkdownTheme } from "./types";
const props = {
  content: {
    required: true,
    type: String,
  },
  className: {
    required: false,
    type: [String, Array] as PropType<string | string[]>,
  },
  /**
   * @deprecated
   */
  aStyle: {
    required: false,
    type: [String, Object] as PropType<string | CSSProperties>,
  },
  theme: {
    required: false,
    type: Object as PropType<MarkdownTheme>,
  },
} as const;

export type MarkdownProps = ExtractPropTypes<typeof props>;

export const Markdown = defineComponent<MarkdownProps>(
  (props,ctx) => {
    const parsedContent = ref("");

    const hasMounted = ref(false);

    const containerRef = useTemplateRef<HTMLElement>("container");
    const className = computed(() => {
      const result: string[] = ["--markdown"];
      if (!props.className) return result;
      if (typeof props.className === "string") {
        result.push(props.className);
        return result;
      }
      result.push(...props.className);
      return result;
    });
    const baseStyle = "img{max-width: 100%;}";
    const generateStyleText = () => {
      const styles = props.theme?.styles;
      if (!styles) return baseStyle;
      const result = Object.entries(styles).reduce(
        (r, [tag, style]) => {
          r.push(`${tag}{${normalizeStyleText(style)}}`);
          return r;
        },
        [baseStyle] as string[]
      );
      return result.join("\n");
    };
    const mountContent = () => {
      const aStyleString = normalizeStyleText(props.aStyle);

      const el = containerRef.value;
      if (!el) return;
      el.innerHTML = `
      <style>
        // 兼容参数
        a{${aStyleString}}
        ${generateStyleText()}
      </style>
      ${parsedContent.value}
    `;
    };
    onMounted(() => {
      if (!containerRef.value) return;
      mountContent();
      hasMounted.value = true;
    });
    watch(
      () => props.content,
      async (n, o) => {
        if (n === o) return;
        parsedContent.value = await marked.parse(n);
        mountContent();
      },
      {
        immediate: true,
      }
    );
    ctx.expose({
      container:containerRef
    })
    return () => <div ref="container" class={className}></div>;
  },
  { props }
);
