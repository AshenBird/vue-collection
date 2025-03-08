import { marked } from "marked";
import {
  computed,
  defineComponent,
  onMounted,
  useTemplateRef,
  type ExtractPropTypes,
  type PropType,
} from "vue";

const props = {
  content: {
    required: true,
    type: String,
  },
  className: {
    required: false,
    type: [String, Array] as PropType<string | string[]>,
  },
} as const;

export type MarkdownProps = ExtractPropTypes<typeof props>;

export const Markdown = defineComponent({
  props,
  setup(props) {
    const parsedContent = computed(() => {
      return marked.parse(props.content);
    });
    const containerRef = useTemplateRef<HTMLElement>("container");
    const className = computed(()=>{
      const result:string[] = ["--markdown"]
      if(!props.className)return result
      if(typeof props.className === "string"){
        result.push(props.className)
        return result
      }
      result.push(...props.className)
      return result
    })
    onMounted(()=>{
      if(!containerRef.value)return
      // 样式优化
      const styleEl = document.createElement("style")
      styleEl.innerText = `
        max-width: 100%;
      `
      containerRef.value.append(styleEl)
    });
    return {
      parsedContent,
      containerRef,
      className,
    };
  },
  render() {
    const { className,parsedContent } = this;
    return (
      <div
        ref="container"
        class={className}
      >
        {
          parsedContent
        }
      </div>
    );
  },
});
