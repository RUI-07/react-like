import { EffectTag, FiberNode, PRIMITIVE_TYPE } from "./types";
import { createDOM, updateProps } from "./createDOM";
import { shallowEqual } from "./util";

// 根据effectTag决定新的DOM对象
export function commitEffect(fiber: FiberNode) {
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

// 比对新旧虚拟DOM节点设置当前节点的effectTag
export function setEffectTag(fiber: FiberNode) {
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
    // @TODO 优化PRIMITIVE_TYPE的处理
    // PRIMITIVE_TYPE 简单处理每次更新都重新生成 
    effectTag =
      element.type !== PRIMITIVE_TYPE ? EffectTag.UPDATE : EffectTag.REMOVE;
  }

  fiber.effectTag = effectTag;
}
