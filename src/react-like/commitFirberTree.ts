import { FiberNode, FiberRoot } from "./types";
import { createfiberTreeInterator } from "./fiberInterator";

function getParentDOM(fiber: FiberNode, container: HTMLElement | null) {
  if (fiber instanceof FiberRoot) {
    return container;
  } else {
    let current = fiber.parent;
    while (current) {
      if (current.dom) return current.dom;
      current = current.parent;
    }
    return container;
  }
}

// 将fiber tree上的DOM对象挂载到页面DOM tree上
export function commitFiberTree(
  fiberRoot?: FiberNode,
  container: HTMLElement | null = null
) {
  if (!fiberRoot || !container) return;
  const fiberInterator = createfiberTreeInterator(fiberRoot);

  for (const fiber of fiberInterator) {
    const parentDOM = getParentDOM(fiber, container);
    if (parentDOM && fiber.dom) {
      (parentDOM as HTMLElement).append(fiber.dom);
    }
  }
}
