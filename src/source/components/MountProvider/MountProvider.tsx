import {
  defineComponent,
  nextTick,
  provide,
  ref,
  useId,
  h,
  type Component,
  type VNode,
} from "vue";
import { MountInjectionKey } from "./constants";
import {
  isMountOptionA,
  type MountOptions,
  type ProviderOption,
} from "./types";
import { createHtmlComponent } from "./utils";

type MountProviderProps = {
  element?: string | Component;
  providers?: ProviderOption[];
};

export const MountProvider = defineComponent(
  (
    props: MountProviderProps,
    ctx: {
      slots: {
        default?: () => VNode;
      };
    }
  ) => {
    const renderMap = ref(new Map<string, MountOptions>());
    const mount = (options: MountOptions) => {
      const id = useId();
      renderMap.value.set(id, options);
      if (options.afterRender) {
        nextTick(options.afterRender);
      }
      return {
        options,
        destroy: () => {
          renderMap.value.delete(id);
        },
      };
    };
    const preRender = (option: MountOptions) => {
      if (isMountOptionA(option)) {
        return option.content();
      }
      const C = option.component;

      return h(C, option.props);
    };
    provide(MountInjectionKey, mount);

    const RootWrap = (() => {
      if (!props.element) return createHtmlComponent();
      if (typeof props.element === "string") {
        const C = createHtmlComponent(props.element);
        return C;
      }
      return createHtmlComponent();
    })();

    const getContent = () => (
      <>
        {ctx.slots.default?.()}
        {Array.from(renderMap.value.values()).map((v) => {
          return preRender(v);
        })}
      </>
    );

    const render = () => {
      const content = getContent();
      if (!props.providers) return <RootWrap>{content}</RootWrap>;
      const providersVNode = props.providers.reduceRight((inner, cur) => {
        // console.debug("cur", cur);
        return h(cur.component, cur.props, inner);
      }, content);
      // console.debug("providersVNode", providersVNode);
      return <RootWrap>{providersVNode}</RootWrap>;
    };
    return render;
  },
  {
    props: {
      element: {
        required: false,
      },
      providers: {
        required: false,
      },
    },
  }
);
