import { Element } from "./types";

export function createElement(
  tag: keyof HTMLElementTagNameMap,
  props: Record<any, any>
): Element {
  const children = props.children
    ? props.children instanceof Array
      ? props.children
      : [props.children]
    : [];
  delete props.children;
  return {
    tag,
    props,
    children
  };
}
