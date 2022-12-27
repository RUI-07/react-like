import { Element, PRIMITIVE_TYPE, ElementType } from "./types";

const formatPropsChildren = (props: Record<any, any>) => {
  return props.children
    ? props.children instanceof Array
      ? props.children.flat()
      : [props.children]
    : [];
};

export function createElement(
  type: ElementType,
  props: Record<any, any>
): Element {
  let children: Element['children'] = undefined
  if (typeof type === "function") {
    const propsCopy = {...props}
    children = () => [type(propsCopy)]
  } else {
    children = formatPropsChildren(props).map((child) => {
      if (child instanceof Element) {
        return child;
      } else {
        const primitive = child;
        return Element.Primitive(primitive);
      }
    });
  }
  delete props.children;
  return new Element({
    type: type,
    props,
    children: children,
  });
}
