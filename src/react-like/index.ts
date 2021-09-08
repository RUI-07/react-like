import {workLoopStart} from "./schedule";
import {
  Renderable,
  Element,
  PRIMITIVE_TYPE,
  PrimitiveElement,
  FunctionComponentElement,
  FirberNode,
} from "./types";
import { hyphenate } from "./util";

export function render(element: Element, container: HTMLElement) {
  // console.log("element", element);
  const firberRoot = new FirberNode({ element });
  
  workLoopStart(firberRoot)
}

