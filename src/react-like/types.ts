export type Renderable = string | number | boolean;

export type FunctionComponent<P = Record<any, any>> = (props: P) => Element;

export const PRIMITIVE_TYPE = Symbol("PRIMITIVE_TYPE");
export type ElementType =
  | keyof HTMLElementTagNameMap
  | FunctionComponent
  | typeof PRIMITIVE_TYPE;

export class Element<T = ElementType, P = Record<any, any>> {
  type: T;
  props: P;
  children?: Element[];

  constructor(params: { type: T; props: P; children?: Element['children'] }) {
    this.type = params.type;
    this.children = params.children;
    this.props = params.props;
  }

  static Primitive(value: any) {
    return new Element<typeof PRIMITIVE_TYPE, { value: string }>({
      type: PRIMITIVE_TYPE,
      children: [],
      props: {
        value: value + "",
      },
    });
  }
}

export type FunctionComponentElement = Element<FunctionComponent>;
export type PrimitiveElement = Element<
  typeof PRIMITIVE_TYPE,
  { value: string }
>;
export enum EffectTag {
  UPDATE,
  REMOVE,
  REUSE,
}

export class FiberNode<T = Element> {
  element: T;
  dom: Node | null = null;
  sibling: FiberNode<T> | null = null;
  parent: FiberNode<T> | null = null;
  child: FiberNode<T> | null = null;
  alternate: FiberNode<T> | null;
  effectTag?: EffectTag;

  constructor(params: {
    element: T;
    alternate: FiberNode<T> | null; // 与当前节点对应的上一次render的节点
    dom?: Node;
    sibling?: FiberNode<T>;
    parent?: FiberNode<T>;
    child?: FiberNode<T>;
  }) {
    const { element, dom, sibling, parent, child, alternate } = params;
    this.element = element;
    this.alternate = alternate;
    dom && (this.dom = dom);
    sibling && (this.sibling = sibling);
    parent && (this.parent = parent);
    child && (this.child = child);
  }
}

export class FiberRoot extends FiberNode {}
