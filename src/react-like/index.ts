import { Renderable, Element } from "./types";
import { hyphenate } from "./util";

function setStyle(style: Record<string, string>, node: HTMLElement) {
  Object.entries(style).map(([key, value]) => {
    const hyphenated: string = hyphenate(key);
    (node.style as any)[hyphenated] = value;
  });
}

function processProps(props: Element, node: HTMLElement) {
  for (const key in props.props) {
    switch (key) {
      case "style":
        setStyle(props.props["style"], node);
        break;
      default:
        node.setAttribute(key, props.props[key]);
    }
  }
}

export function render(element: Renderable, container: HTMLElement) {
  // console.log("element", element);
  if (typeof element === "object") {
    const { props, type, children } = element;
    console.log("type", type);
    switch (typeof type) {
      case "function":
        const FC = type;
        render(FC({ ...props, children }), container);
        break;
      default:
        const node = document.createElement(type);
        processProps(element, node);
        element.children.forEach((item) => render(item, node));
        container.append(node);
        break;
    }
  } else {
    const text = element.toString();
    container.append(text);
  }
}
