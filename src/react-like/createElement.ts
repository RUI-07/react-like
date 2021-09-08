import { Element, PRIMITIVE_TYPE, ElementType } from "./types";

export function createElement(
  type: ElementType,
  props: Record<any, any>
): Element {
  const children: any[] = props.children
    ? props.children instanceof Array
      ? props.children.flat()
      : [props.children]
    : [];
  delete props.children;
  return new Element({
    type: type,
    props,
    children: children.map((child) => {
      if (child instanceof Element) {
        return child;
      } else {
        const primitive = child;
        return Element.Primitive(primitive);
      }
    }),
  });
}
