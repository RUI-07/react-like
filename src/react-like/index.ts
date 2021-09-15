import { workLoopStart } from "./schedule";
import { Element, FiberNode, FiberRoot } from "./types";

// let oldFiberRoot: FiberNode | null = null;
// let fiberRoot: FiberNode | null = null;

export function render(element: Element, container: HTMLElement) {
  console.log("container", container);
  const fiberRoot = new FiberRoot({ element });

  workLoopStart(fiberRoot, container);
}
