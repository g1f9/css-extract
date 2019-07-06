import { IAttr } from "../parser/SimpleHtmlParser";
export default class VNode {
  name = "";
  attrs: IAttr[] = [];
  children: VNode[] = [];
  class: string[] = [];
  parent: VNode | null = null;
  constructor(tagName: string, attrs: IAttr[]) {
    this.name = tagName;
    this.attrs = attrs;
    for (const attr of attrs) {
      if (attr.name === "class" && attr.value) {
        this.class = attr.value.split(" ");
      }
    }
  }
  addChild(node: VNode) {
    this.children.push(node);
  }
}
