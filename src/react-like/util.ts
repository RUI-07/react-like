export function hyphenate(camelStr: string) {
  // 判断是否是 大驼峰
  const isUpper =
    camelStr[0].charCodeAt(0) >= 65 && camelStr[0].charCodeAt(0) <= 90;
  const handleStr = camelStr.replace(/([A-Z])/g, "-$1").toLowerCase();
  let kebabStr = handleStr;
  if (isUpper) {
    kebabStr = handleStr.slice(1);
  }
  // 处理连续大写的情况
  const newKebabArr: string[] = [];
  const kebabSplitArr = kebabStr.split("-");
  kebabSplitArr.forEach((item, index) => {
    if (item.length > 1) {
      newKebabArr.push(item);
    } else {
      let combineStr = "";
      const subKebabArr = kebabSplitArr.slice(index);
      for (let i = 0; i < subKebabArr.length; i++) {
        if (subKebabArr[i].length > 1) break;
        combineStr += subKebabArr[i];
      }
      newKebabArr.push(combineStr);
      kebabSplitArr.splice(index + 1, combineStr.length - 1);
    }
  });
  return newKebabArr.join("-");
}

export function shallowEqual(
  objA: Record<any, any>,
  objB: Record<any, any>
): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }
  return true;
}

export function arrayShallowEqual(a: any[], b: any[]) {
  if (a.length !== b.length) {
    return false;
  } else {
    return a.every((item, index) => item === b[index]);
  }
}
