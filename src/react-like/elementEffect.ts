import { EffectTag, FiberNode, FiberRoot, PRIMITIVE_TYPE } from "./types";
import { createDOM, updateProps } from "./createDOM";
import { shallowEqual } from "./util";

function getParentDOM(fiber: FiberNode) {
  let current = fiber.parent;
  while (current) {
    if (current instanceof FiberRoot) {
      return current.container;
    }
    if (current.dom) return current.dom;
    current = current.parent;
  }
  return null;
}

// 根据effectTag决定新的DOM对象
export function commitEffect(fiber: FiberNode) {
  const element = fiber.element;
  const oldDOM = fiber.alternate?.dom || null;
  const oldProps = fiber.alternate?.element.props || {};
  const effectTag = fiber.effectTag;

  switch (effectTag) {
    case EffectTag.REUSE: {
      return oldDOM;
    }
    case EffectTag.UPDATE: {
      updateProps(oldProps, element.props, oldDOM as HTMLElement);
      return oldDOM;
    }
    case EffectTag.REPLACE: {
      const neoDOM = createDOM(fiber.element);
      oldDOM?.parentNode?.replaceChild(neoDOM, oldDOM);
      return neoDOM;
    }
    case EffectTag.APPEND: {
      const neoDOM = createDOM(fiber.element);
      const parent = getParentDOM(fiber);
      parent?.appendChild(neoDOM);
      return neoDOM;
    }
    default: {
      return createDOM(fiber.element);
    }
  }
}

// 比对新旧虚拟DOM节点设置当前节点的effectTag
export function setEffectTag(fiber: FiberNode) {
  const oldFiber = fiber.alternate;
  const oldElement = oldFiber?.element;
  const element = fiber.element;
  let effectTag: EffectTag | undefined = undefined;
  if (!oldFiber?.dom || !oldElement) {
    effectTag = EffectTag.APPEND;
  } else if (oldElement.type !== element.type) {
    effectTag = EffectTag.REPLACE;
  } else if (shallowEqual(oldElement.props, element.props)) {
    effectTag = EffectTag.REUSE;
  } else {
    // @TODO 优化PRIMITIVE_TYPE的处理
    // PRIMITIVE_TYPE 简单处理每次更新都重新生成
    effectTag =
      element.type !== PRIMITIVE_TYPE ? EffectTag.UPDATE : EffectTag.REPLACE;
  }

  fiber.effectTag = effectTag;
}
