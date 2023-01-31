import {
  EffectTag,
  FiberNode,
  FiberRoot,
  isFunctionComponent,
  PRIMITIVE_TYPE,
} from "./types";
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

function getOldDOM(fiber: FiberNode) {
  const oldFiber = fiber.alternate;
  if (!oldFiber) return null;
  if (isFunctionComponent(oldFiber)) {
    return oldFiber.child?.dom;
  } else {
    return oldFiber.dom;
  }
}

// 根据effectTag决定新的DOM对象
export function commitEffect(fiber: FiberNode) {
  const element = fiber.element;
  const oldDOM = getOldDOM(fiber);
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
      if (neoDOM) {
        oldDOM?.parentNode?.replaceChild(neoDOM, oldDOM);
      } else {
        oldDOM?.parentNode?.removeChild(oldDOM);
      }
      return neoDOM;
    }
    case EffectTag.APPEND: {
      const neoDOM = createDOM(fiber.element);
      const parent = getParentDOM(fiber);
      neoDOM && parent?.appendChild(neoDOM);
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
  if (!oldFiber || !oldElement) {
    effectTag = EffectTag.APPEND;
  } else if (oldElement.type !== element.type) {
    effectTag = EffectTag.REPLACE;
  } else if (shallowEqual(oldElement.props, element.props)) {
    effectTag = EffectTag.REUSE;
  } else {
    effectTag =
      element.type !== PRIMITIVE_TYPE ? EffectTag.UPDATE : EffectTag.REPLACE;
  }

  fiber.effectTag = effectTag;
}
