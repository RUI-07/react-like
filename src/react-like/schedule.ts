import { FiberNode } from "./types";
import { pickNextFiber, createFiberChildrenInterator } from "./fiberInterator";
import { commitFirberTree } from "./commitFirberTree";
import { commitEffect, setEffectTag } from "./elementEffect";

let root: FiberNode | undefined = undefined;
let container: HTMLElement | undefined = undefined;

let nextUnitOfWork: FiberNode | null = null;

function elementIsComponent(fiber: FiberNode) {
  return typeof fiber.element.type === "function";
}

function performUnitOfWork(fiber: FiberNode): FiberNode | null {
  // 更新FiberNode对应的真实DOM
  if (!elementIsComponent(fiber) && !fiber.dom) {
    setEffectTag(fiber);
    fiber.dom = commitEffect(fiber);
  }

  const children = fiber.element.children;
  const childElements =
    (typeof children === "function" ? children() : children) || [];
  const oldFiberChildren = createFiberChildrenInterator(fiber.alternate?.child);

  let childFirbers: FiberNode[] = [];
  let current: FiberNode | undefined = undefined;
  // 根据子虚拟DOM节点创建子Fiber节点
  for (const element of childElements) {
    const newFirber = new FiberNode({
      element,
      parent: fiber,
      alternate: oldFiberChildren.next().value || null,
    });
    // 兄弟节点之间通过sibling字段相连
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
    // 通过requestIdleCallback回调参数deatline得知离下一次浏览器渲染还有多久
    // 判断是否应该中断workLoop
    shouldYield = deadline.timeRemaining() < 1;

    // 没有下一个需要处理的Fiber节点
    if (!nextUnitOfWork) {
      console.log("commit root", root);
      // 渲染DOM
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
  // 开始执行
  requestIdleCallback(workLoop);
}
