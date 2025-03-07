import type {
  VNodeChild,
  Component,
  VNodeProps,
  ComponentInstance,
} from "vue";

type DefaultProps = Record<string, any>;

export type InferProviderOptions<T extends ProviderOption[]> = {
  [K in keyof T]: T[K] extends ProviderOption<infer C>?{
    component: C;
    props?: InferProps<C>;
  }:never
  ;
};

export type InferProviderOption<C extends Component> = {
  component: C;
  props?: InferProps<C>;
};
type InnerProps =
  | "$"
  | "$data"
  | "$props"
  | "$attrs"
  | "$refs"
  | "$slots"
  | "$root"
  | "$parent"
  | "$host"
  | "$emit"
  | "$el"
  | "$options"
  | "$forceUpdate"
  | "$nextTick"
  | "$watch";

export type InferProps<T extends Component> = Omit<ComponentInstance<T>['$props'], keyof VNodeProps|'class'|'style'|InnerProps >
export type ProviderOption<C extends Component = Component> = {
  component: C;
  props?: InferProps<C>;
};
type MountBaseOptions = {
  afterRender?: () => void;
};
type MountOptionsA = {
  content: () => VNodeChild;
} & MountBaseOptions;

type MountOptionsB<Props extends DefaultProps = DefaultProps> = {
  component: Component;
  props?: Props;
} & MountBaseOptions;

export type MountOptions<Props extends DefaultProps = DefaultProps> =
  | MountOptionsA
  | MountOptionsB<Props>;
export type MountApiInjection = (options: MountOptions) => {
  options: MountOptions;
  destroy: () => void;
};
export const isMountOptionA = (
  options: MountOptions
): options is MountOptionsA => {
  if ((options as MountOptionsA).content) {
    return true;
  }
  return false;
};
