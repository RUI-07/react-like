import {
  EffectTag,
  FiberNode,
  PRIMITIVE_TYPE,
} from "./types";
import { createDOM, updateProps } from "./createDOM";
import { pickNextFiber, createFiberChildrenInterator } from "./fiberInterator";
import { commitFirberTree } from "./commitFirberTree";
import { shallowEqual } from "./util";

let root: FiberNode | undefined = undefined;
let container: HTMLElement | undefined = undefined;

let nextUnitOfWork: FiberNode | null = null;

function commitEffect(fiber: FiberNode) {
  const element = fiber.element;
  const oldDOM = fiber.alternate?.dom || null;
  const oldProps = fiber.alternate?.element.props || {};
  if (!oldDOM) return createDOM(element);

  const effectTag = fiber.effectTag;

  switch (effectTag) {
    case EffectTag.REUSE:
      return oldDOM;
    case EffectTag.UPDATE:
      updateProps(oldProps, element.props, oldDOM as HTMLElement);
      return oldDOM;
    case EffectTag.REMOVE:
      oldDOM.parentNode?.removeChild(oldDOM);
      return createDOM(fiber.element);
    default:
      return createDOM(fiber.element);
  }
}

function setEffectTag(fiber: FiberNode) {
  const oldFiber = fiber.alternate;
  if (!oldFiber) {
    return;
  }

  const oldElement = oldFiber.element;
  const element = fiber.element;
  let effectTag: EffectTag | undefined = undefined;
  if (oldElement.type !== element.type) {
    effectTag = EffectTag.REMOVE;
  } else if (shallowEqual(oldElement.props, element.props)) {
    effectTag = EffectTag.REUSE;
  } else {
    effectTag =
      element.type !== PRIMITIVE_TYPE ? EffectTag.UPDATE : EffectTag.REMOVE;
  }

  fiber.effectTag = effectTag;
}

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
      alternate: oldFiberChildren.next().value,
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
