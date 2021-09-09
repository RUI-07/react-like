import { workLoopStart } from "./schedule";
import { Element, FiberNode } from "./types";

export function render(element: Element, container: HTMLElement) {
  console.log("container", container);
  const fiberRoot = new FiberNode({ element });

  workLoopStart(fiberRoot, container);
}
