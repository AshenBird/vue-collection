import { marked } from "marked";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useTemplateRef,
  watch,
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
    const parsedContent = ref("")
    
    const hasMounted = ref(false)
        
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

    
    const mountContent = ()=>{
      const el = containerRef.value
      if(!el)return
      el.innerHTML = `
        <style>
          max-width: 100%;
        </style>
        ${
          parsedContent.value
        }
      `
    }
    onMounted(()=>{
      if(!containerRef.value)return
      mountContent();
    });
    watch(()=>props.content,async (n,o)=>{
      if(n===o)return;
      parsedContent.value = await marked.parse(n);
      mountContent();
    },{
      immediate:true
    })
    return {
      parsedContent,
      containerRef,
      className,
    };
  },
  render() {
    const { className } = this;
    return (
      <div
        ref="container"
        class={className}
      >
      </div>
    );
  },
});
