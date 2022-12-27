import { workLoopStart } from "./schedule";
import { Element, FiberNode, FiberRoot } from "./types";

const CURRENT_SYM = "CONTAINER_SYM";

export function render(element: Element, container: HTMLElement) {
  // @ts-ignore
  const current: FiberRoot | undefined = container[CURRENT_SYM];
  !current && (container.innerHTML = "");

  const fiberRoot = new FiberRoot({ element, alternate: current || null });

  // @ts-ignore
  container[CURRENT_SYM] = fiberRoot;

  workLoopStart(fiberRoot, container);
}
