import { FiberNode, FiberRoot } from "./types";
import {createfiberTreeInterator} from './fiberInterator'

export function commitFirberTree(
  fiberRoot?: FiberNode,
  container: HTMLElement | null = null
) {
  if (!fiberRoot || !container) return;
  const fiberInterator = createfiberTreeInterator(fiberRoot);

  for (const fiber of fiberInterator) {
    const parentDOM =
      fiber instanceof FiberRoot ? container : fiber.parent?.dom;
    if (parentDOM && fiber.dom) {
      (parentDOM as HTMLElement).append(fiber.dom);
    }
  }
}
