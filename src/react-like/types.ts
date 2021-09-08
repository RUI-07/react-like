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
  children: Element[];

  constructor(params: { type: T; props: P; children: Element[] }) {
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

export class FirberNode {
  element: Element;
  dom: Node | null = null;
  sibling: FirberNode | null = null;
  parent: FirberNode | null = null;
  child: FirberNode | null = null;

  constructor(params: {
    element: Element;
    dom?: Node;
    sibling?: FirberNode;
    parent?: FirberNode;
    child?: FirberNode;
  }) {
    const { element, dom, sibling, parent, child } = params;
    this.element = params.element;
    dom && (this.dom = dom);
    sibling && (this.sibling = sibling);
    parent && (this.parent = parent);
    child && (this.child = child);
  }
}
