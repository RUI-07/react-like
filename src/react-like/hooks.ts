import { nextUnitOfWork, updateWorkLoop } from "./schedule";
import { EffectHook, FiberNode, Hook, StateHook } from "./types";
import { arrayShallowEqual } from "./util";

function isStateHook(hook: Hook): hook is StateHook {
  const stateHook = hook as StateHook;
  return "state" in stateHook && "setState" in stateHook;
}

function isEffectHook(hook: Hook): hook is EffectHook {
  const effectHook = hook as EffectHook;
  return "deps" in effectHook;
}

let preUnitOfWork: FiberNode | null = null;
let hookIndex = 0;

const getHook = (whenEmpty: () => Hook) => {
  if (!nextUnitOfWork) {
    throw new Error("nextUnitOfWork has been null when useState is called");
  }
  if (!nextUnitOfWork.element.hooks) {
    nextUnitOfWork.element.hooks = [];
  }
  const hooks = nextUnitOfWork.element.hooks;
  if (preUnitOfWork === nextUnitOfWork) {
    hookIndex++;
  } else {
    hookIndex = 0;
  }
  preUnitOfWork = nextUnitOfWork;
  if (hooks[hookIndex]) {
    return hooks[hookIndex];
  } else {
    const hook = whenEmpty();
    hooks[hookIndex] = hook;
    return hook;
  }
};

export function useState<T>(initial: T) {
  const hook = getHook(() => {
    const hook: StateHook<T> = {
      state: initial,
      setState(setter) {
        const value = setter(this.state);
        this.state = value;

        updateWorkLoop(() => {
          // 清空遍历hook过程的状态
          preUnitOfWork = null;
        });
      },
    };
    hook.setState = hook.setState.bind(hook);
    return hook;
  });
  if (!isStateHook(hook)) {
    throw new Error("hook type cannot be changed");
  }
  return [hook.state, hook.setState] as [
    StateHook<T>["state"],
    StateHook<T>["setState"]
  ];
}

type Effect = () => (() => void | undefined) | void;
export function useEffect(effect: Effect, deps: any[]) {
  let isEmpty = false;
  const hook = getHook(() => {
    isEmpty = true;
    const hook: EffectHook = {
      deps,
      onUnmount: effect(),
    };
    return hook;
  });
  if (!isEffectHook(hook)) {
    throw new Error("hook type cannot be changed");
  }
  if (!isEmpty) {
    const oldDeps = hook.deps;
    hook.deps = deps;
    if (!arrayShallowEqual(oldDeps, deps)) {
      hook.onUnmount = effect();
    }
  }
}
