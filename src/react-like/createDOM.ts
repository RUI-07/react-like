import { Element, PRIMITIVE_TYPE, PrimitiveElement } from "./types";
import { hyphenate } from "./util";

function setStyle(style: Record<string, string>, node: HTMLElement) {
  Object.entries(style).map(([key, value]) => {
    const hyphenated: string = hyphenate(key);
    (node.style as any)[hyphenated] = value;
  });
}

function processProps(props: Record<any, any>, node: HTMLElement) {
  for (const key in props) {
    switch (key) {
      case "style":
        setStyle(props["style"], node);
        break;
      default:
        node.setAttribute(key, props[key]);
    }
  }
}

export function updateProps(
  oldProps: Record<any, any>,
  props: Record<any, any>,
  node: HTMLElement
) {
  for (const key in oldProps) {
    node.removeAttribute(key);
  }
  processProps(props, node);
}

// 根据Element类型生成对应的HTMLDOMNode
export function createDOM(element: Element): Node {
  console.log("element", element);
  const { type } = element;
  if (typeof type === "function") {
    return document.createTextNode("");
  } else if (type === PRIMITIVE_TYPE) {
    const textNode = document.createTextNode(
      (element as PrimitiveElement).props.value
    );
    return textNode;
  } else {
    const node = document.createElement(type);
    processProps(element.props, node);
    return node;
  }
}
