import { EffectTag, FiberNode, PRIMITIVE_TYPE } from "./types";
import { createDOM, updateProps } from "./createDOM";
import { shallowEqual } from "./util";

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
    effectTag =
      element.type !== PRIMITIVE_TYPE ? EffectTag.UPDATE : EffectTag.REMOVE;
  }

  fiber.effectTag = effectTag;
}
