import { nextUnitOfWork, updateWorkLoop } from "./schedule";
import { FiberNode, StateHook } from "./types";

let preUnitOfWork: FiberNode | null = null;
let hookIndex = 0;
export function useState<T>(initial: T) {
  const currentNode = nextUnitOfWork;
  if (!currentNode) {
    throw new Error('nextUnitOfWork has been null when useState is called')
  };
  if (!currentNode.element.hooks) {
    currentNode.element.hooks = [];
  }
  const hooks = currentNode.element.hooks;
  if (preUnitOfWork === currentNode) {
    hookIndex++;
  } else {
    hookIndex = 0;
  }
  if (!hooks[hookIndex]) {
    hooks[hookIndex] = {
      state: initial,
      setState: (setter) => {
        const value = setter(initial);
        hooks[hookIndex].state = value;
        preUnitOfWork = null
        updateWorkLoop(currentNode);
      },
    };
  }
  const hook = hooks[hookIndex];
  preUnitOfWork = currentNode;
  console.log('middle', currentNode.element.hooks)
  return [hook.state, hook.setState] as [StateHook<T>['state'], StateHook<T>['setState']];
}
