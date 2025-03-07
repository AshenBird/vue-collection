import { marked } from "marked";
import {
  computed,
  defineComponent,
  h,
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
    const containerRef = useTemplateRef("container");
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
          h(parsedContent)
        }
      </div>
    );
  },
});
