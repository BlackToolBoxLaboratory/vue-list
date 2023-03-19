const getStyle = (classList, styleObj) => {
  let classObj: Record<string, any> = {};
  classList.forEach((classname) => {
    classObj = Object.assign(
      {},
      classObj,
      searchStyleByClassName(classname, styleObj)
    );
  });
  return classObj;
}

const searchStyleByClassName = (classname, styleObj) => {
  let result = {};
  if (typeof styleObj === "object") {
    Object.keys(styleObj).find((specname) => {
      if (specname === classname) {
        result = Object.assign({}, styleObj[specname]);
        return true;
      }
    });
  }
  return result;
}

export {
  getStyle
}