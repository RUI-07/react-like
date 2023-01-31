import {
  FiberNode,
  Element as FiberElement,
  FunctionComponent,
  isFunctionComponent,
  FiberRoot,
} from "./types";
import { pickNextFiber, createFiberChildrenInterator } from "./fiberInterator";
import { commitFiberTree, mountDOM } from "./commitFirberTree";
import { setEffectTag } from "./elementEffect";

let root: FiberRoot | undefined = undefined;

export let nextUnitOfWork: FiberNode | null = null;

function updateFunctionComponent(
  fiber: FiberNode<FiberElement<FunctionComponent>>
) {
  const element = fiber.element;
  const component = element.type;
  if (fiber.alternate) {
    setEffectTag(fiber);
  }
  // 还是相同组件 保持上次渲染时的hook状态
  if (component === fiber.alternate?.element.type) {
    fiber.element.hooks = fiber.alternate?.element.hooks;
  }
  const children = [
    component({ ...element.props, children: element.children }),
  ];
  reconcileChildren(fiber, children);
  return fiber;
}

// 更新FiberNode对应的真实DOM
function updateHostComponent(fiber: FiberNode) {
  if (!fiber.dom) {
    setEffectTag(fiber);
  }
  const children = fiber.element.children || [];

  reconcileChildren(fiber, children);
  return fiber;
}

function reconcileChildren(
  fiber: FiberNode,
  childElements: FiberNode["element"][]
) {
  const oldFiberChildren = createFiberChildrenInterator(fiber.alternate?.child);

  let childFirbers: FiberNode[] = [];
  let current: FiberNode | undefined = undefined;
  // 根据子虚拟DOM节点创建子Fiber节点
  for (const element of childElements) {
    const alternate = oldFiberChildren.next().value || null;
    if (alternate) {
      alternate.alternate = null;
    }
    const newFirber = new FiberNode({
      element,
      parent: fiber,
      alternate,
    });
    // 兄弟节点之间通过sibling字段相连
    current && (current.sibling = newFirber);
    current = newFirber;
    childFirbers.push(newFirber);
  }
  fiber.child = childFirbers[0];
}

function performUnitOfWork(fiber: FiberNode): FiberNode | null {
  if (isFunctionComponent(fiber)) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  return pickNextFiber(fiber);
}

function workLoop(deadline: IdleDeadline, callback?: () => void) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 通过requestIdleCallback回调参数deatline得知离下一次浏览器渲染还有多久
    // 判断是否应该中断workLoop
    shouldYield = deadline.timeRemaining() < 1;

    // 没有下一个需要处理的Fiber节点
    if (!nextUnitOfWork) {
      // 执行DOM修改
      commitFiberTree(root, root?.container);
      console.log("root", root);
      callback?.();
      return;
    }
  }

  requestIdleCallback((deadline) => workLoop(deadline, callback));
}

export function workLoopStart(fiberRoot: FiberRoot) {
  root = fiberRoot;
  nextUnitOfWork = fiberRoot;
  // 开始执行
  requestIdleCallback((deadline) =>
    workLoop(deadline, () => {
      mountDOM(fiberRoot, fiberRoot.container);
    })
  );
}

export function updateWorkLoop(callBack?: () => void) {
  if (!root) return;
  root.alternate = null;
  const node = {
    ...root,
    alternate: root,
  };
  root = node;
  nextUnitOfWork = node; // 开始执行
  // 开始执行
  requestIdleCallback((deadline) => workLoop(deadline, callBack));
}
