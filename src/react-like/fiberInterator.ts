import { FiberNode } from "./types";

export function pickNextFiber(fiber: FiberNode) {
  if (fiber.child) return fiber.child;
  let current: FiberNode | null = fiber;
  while (current) {
    if (current.sibling) {
      return current.sibling;
    }
    current = current.parent;
  }
  return current;
}

export function* createfiberTreeInterator(fiberRoot: FiberNode) {
  let current = fiberRoot;
  while (current) {
    yield current;
    const next = pickNextFiber(current);
    if (next) {
      current = next;
    } else {
      break;
    }
  }
  return;
}

export function* createFiberChildrenInterator(firstChild?: FiberNode | null) {
  let current = firstChild;
  while (current) {
    yield current;
    current = current.sibling;
  }
  return null
}


