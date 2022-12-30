import { FiberNode, isFunctionComponent } from "./types";
import { createfiberTreeInterator } from "./fiberInterator";
import { commitEffect } from "./elementEffect";

// 执行每个fiberNode对应的DOM处理
export function commitFiberTree(
  fiberRoot?: FiberNode,
  container: HTMLElement | null = null
) {
  if (!fiberRoot || !container) return;
  const fiberInterator = createfiberTreeInterator(fiberRoot);

  for (const fiber of fiberInterator) {
    // 函数组件对应节点没有DOM不需要处理
    if (isFunctionComponent(fiber)) continue;
    fiber.dom = commitEffect(fiber);
  }
}

// 挂载DOM树到容器
export function mountDOM(fiberRoot: FiberNode, container: HTMLElement) {
  container.innerHTML = "";
  const fiberInterator = createfiberTreeInterator(fiberRoot);
  // 由上自下找到第一个DOM挂载到container中
  for (const fiber of fiberInterator) {
    if (fiber.dom) {
      container.append(fiber.dom);
      return
    }
  }
}
