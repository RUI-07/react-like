export interface Element<Props = Record<any, any>> {
  tag: keyof HTMLElementTagNameMap;
  props: Props;
  children: Renderable[];
}

export type Renderable = Element | string | number | boolean;
