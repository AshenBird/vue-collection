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
  normalizeStyle,
} from "vue";
import { normalizeStyleText } from "../../utils";
const props = {
  content: {
    required: true,
    type: String,
  },
  className: {
    required: false,
    type: [String, Array] as PropType<string | string[]>,
  },
  aStyle:{
    required: false,
    type: [String, Object] as PropType<string | CSSProperties>,
  }
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
      const aStyleString = normalizeStyleText(props.aStyle)
      const el = containerRef.value
      if(!el)return
      el.innerHTML = `
        <style>
          img{max-width: 100%;}
          a{${aStyleString}}
        </style>
        ${
          parsedContent.value
        }
      `
    }
    onMounted(()=>{
      if(!containerRef.value)return
      mountContent();
      hasMounted.value =true
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
