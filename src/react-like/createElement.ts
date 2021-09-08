import { Element, FunctionComponent } from "./types";

export function createElement(
  type: keyof HTMLElementTagNameMap| FunctionComponent,
  props: Record<any, any>
): Element {
  const children = props.children
    ? props.children instanceof Array
      ? props.children
      : [props.children]
    : [];
  delete props.children;
  return {
    type: type,
    props,
    children
  };
}
