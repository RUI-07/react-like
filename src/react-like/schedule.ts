import { FiberNode } from "./types";
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

export function commitFirberTree(fiberRoot?: FiberNode, container?: Node) {
  if (!fiberRoot || !container || !fiberRoot.dom) return;
  (container as HTMLElement).append(fiberRoot.dom);

  if (fiberRoot.child) {
    commitFirberTree(fiberRoot.child, fiberRoot.dom);
  }

  if (fiberRoot.sibling) {
    commitFirberTree(fiberRoot.sibling, container);
  }
}
