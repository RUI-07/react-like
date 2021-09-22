import { FiberNode } from "./types";
import { pickNextFiber, createFiberChildrenInterator } from "./fiberInterator";
import { commitFirberTree } from "./commitFirberTree";
import { commitEffect, setEffectTag } from "./elementEffect";

let root: FiberNode | undefined = undefined;
let container: HTMLElement | undefined = undefined;

let nextUnitOfWork: FiberNode | null = null;

function performUnitOfWork(fiber: FiberNode): FiberNode | null {
  if (!fiber.dom) {
    setEffectTag(fiber);
    fiber.dom = commitEffect(fiber);
  }

  const childElements = fiber.element.children;
  const oldFiberChildren = createFiberChildrenInterator(fiber.alternate?.child);

  let childFirbers: FiberNode[] = [];
  let current: FiberNode | undefined = undefined;
  for (const element of childElements) {
    const newFirber = new FiberNode({
      element,
      parent: fiber,
      alternate: oldFiberChildren.next().value || null,
    });
    current && (current.sibling = newFirber);
    current = newFirber;
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
