import { FiberNode, FiberRoot } from "./types";
import { createDOM } from "./createDOM";

let root: FiberNode | undefined = undefined;
let container: HTMLElement | undefined = undefined;

function pickNextFiber(fiber: FiberNode) {
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

let nextUnitOfWork: FiberNode | null = null;

function performUnitOfWork(fiber: FiberNode): FiberNode | null {
  if (!fiber.dom) {
    fiber.dom = createDOM(fiber.element);
  }

  const childElements = fiber.element.children;
  let childFirbers: FiberNode[] = [];
  let preChildFirber: FiberNode | undefined = undefined;
  for (let i = 0; i < childElements.length; i++) {
    const element = childElements[i];
    const newFirber = new FiberNode({ element, parent: fiber });
    preChildFirber && (preChildFirber.sibling = newFirber);
    preChildFirber = newFirber;
    childFirbers.push(newFirber);
  }
  fiber.child = childFirbers[0];

  return pickNextFiber(fiber);
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;

    if (!nextUnitOfWork) {
      console.log("commit root", root);
      commitFirberTree(root, container);
    }
  }

  requestIdleCallback(workLoop);
}

export function workLoopStart(
  fiberRoot: FiberNode,
  rootContainer: HTMLElement
) {
  root = fiberRoot;
  container = rootContainer;
  nextUnitOfWork = fiberRoot;
  requestIdleCallback(workLoop);
}

function* createfiberTreeInterator(fiberRoot: FiberNode) {
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

export function commitFirberTree(
  fiberRoot?: FiberNode,
  container: Node | null = null
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
