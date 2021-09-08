import { Renderable } from "./types";
import { hyphenate } from "./util";

function setStyle(style: Record<string, string>, node: HTMLElement) {
  Object.entries(style).map(([key, value]) => {
    const hyphenated: string = hyphenate(key);
    (node.style as any)[hyphenated] = value;
  });
}

export function render(element: Renderable, container: HTMLElement) {
  // console.log("element", element);
  if (typeof element === "object") {
    const node = document.createElement(element.tag);
    for (const key in element.props) {
      switch (key) {
        case "style":
          setStyle(element.props['style'], node);
          break;
        default:
          node.setAttribute(key, element.props[key]);
      }
    }
    element.children.forEach((item) => render(item, node));
    container.append(node);
  } else {
    const text = element.toString();
    container.append(text);
  }
}
