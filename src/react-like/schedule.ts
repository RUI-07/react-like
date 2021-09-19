import { FiberNode, FiberRoot } from "./types";
import { createDOM } from "./createDOM";
import {pickNextFiber} from './fiberInterator'
import {commitFirberTree} from './commitFirberTree'


let root: FiberNode | undefined = undefined;
let container: HTMLElement | undefined = undefined;

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
