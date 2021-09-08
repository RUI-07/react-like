import { FirberNode } from "./types";
import { createDOM } from "./createDOM";

function pickNextFirber(firber: FirberNode) {
  return firber.child || firber.sibling || firber.parent || null;
}

let nextUnitOfWork: FirberNode | null = null;

function performUnitOfWork(firber: FirberNode): FirberNode | null {
  if (!firber.dom) {
    firber.dom = createDOM(firber.element);
  }
  if (firber.parent?.dom) {
    firber.parent.dom.appendChild(firber.dom);
  }

  const childElements = firber.element.children;
  let childFirbers: FirberNode[] = [];
  let preChildFirber: FirberNode | undefined = undefined;
  for (let i = 0; i < childElements.length; i++) {
    const element = childElements[i];
    const newFirber = new FirberNode({ element });
    preChildFirber && (preChildFirber.sibling = newFirber);
    preChildFirber = newFirber;
    childFirbers.push(newFirber);
  }
  firber.child = childFirbers[0];

  return pickNextFirber(firber);
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

export function workLoopStart(firberRoot: FirberNode) {
  nextUnitOfWork = firberRoot;
  requestIdleCallback(workLoop);
}


