import VNode from "../vnode/Vnode";
export default class ScssPrinter {
  print(node: VNode) {
    let nodeClass = node.class;
    let result = "";
    let printStr = this.selectClass(nodeClass);
    let indentation = this.makeIndentation(node);

    if (nodeClass.length > 0) {
      result = `${indentation}.${printStr}{\n${this.printChildren(
        node.children
      )}\n${indentation}}`;
    } else {
      result = this.printChildren(node.children);
    }
    return result;
  }
  printChildren(node: VNode[]) {
    if (node.length === 0) {
      return "";
    }
    let result = "";
    result = node.reduce((curr, node: VNode) => {
      return `${curr.length > 0 ? curr + "\n" : curr}${this.print(node)}`;
    }, result);
    return result;
  }
  selectClass(classes: string[]) {
    return classes.reduce((curr: string, maxLenClass: string) => {
      return curr.length > maxLenClass.length ? curr : maxLenClass;
    }, "");
  }
  makeIndentation(node: VNode) {
    let str = "";
    let parent = node.parent;
    while (parent) {
      str += "  ";
      parent = parent.parent;
    }
    return str;
  }
}
