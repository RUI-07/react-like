import { workLoopStart } from "./schedule";
import { Element, FiberNode, FiberRoot, CURRENT_SYM } from "./types";

export function render(element: Element, container: HTMLElement) {
  // @ts-ignore
  const current: FiberRoot | undefined = container[CURRENT_SYM];
  const fiberRoot = new FiberRoot({ element, alternate: current || null });
  // @ts-ignore
  container[CURRENT_SYM] = fiberRoot;
  workLoopStart(fiberRoot, container);
}
