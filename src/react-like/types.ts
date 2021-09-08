export type FunctionComponent<P = Record<any, any>> = (props: P) => Renderable;
export interface Element<Props = Record<any, any>> {
  type: keyof HTMLElementTagNameMap | FunctionComponent;
  props: Props;
  children: Renderable[];
}

export type Renderable = Element | string | number | boolean;
