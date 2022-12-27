import { Element, PRIMITIVE_TYPE, PrimitiveElement } from "./types";
import { hyphenate } from "./util";

function getEventType(event: string) {
  return event.slice(2).toLowerCase();
}

function setStyle(style: Record<string, string>, node: HTMLElement) {
  Object.entries(style).map(([key, value]) => {
    const hyphenated: string = hyphenate(key);
    (node.style as any)[hyphenated] = value;
  });
}

function processProps(props: Record<any, any>, node: HTMLElement) {
  for (const key in props) {
    if (key.startsWith("on")) {
      node.addEventListener(getEventType(key), props[key]);
    } else if (key === "style") {
      setStyle(props["style"], node);
    } else {
      node.setAttribute(key, props[key]);
    }
  }
}

function cleanProps(props: Record<any, any>, node: HTMLElement) {
  for (const key in props) {
    if (key.startsWith("on")) {
      node.removeEventListener(getEventType(key), props[key]);
    } else {
      node.removeAttribute(key);
    }
  }
}

export function updateProps(
  oldProps: Record<any, any>,
  props: Record<any, any>,
  node: HTMLElement
) {
  cleanProps(oldProps, node);
  processProps(props, node);
}

// 根据Element类型生成对应的HTML DOM Node
export function createDOM(element: Element): Node {
  const { type } = element;
  if (typeof type === "function") {
    // @TODO 支持Function component
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
