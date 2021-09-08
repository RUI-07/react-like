import { Renderable } from "./types";

export function render(element: Renderable, container: HTMLElement) {
  // console.log("element", element);
  if (typeof element === "object") {
    const node = document.createElement(element.tag);
    for (const key in element.props) {
      node.setAttribute(key, element.props[key]);
    }
    element.children.forEach((item) => render(item, node));
    container.append(node);
  } else {
    const text = element.toString();
    container.append(text);
  }
}
