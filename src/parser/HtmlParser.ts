import SimpleHtmlParser, { IAttr } from "./SimpleHtmlParser";
import VNode from "../vnode/Vnode";
export default class HtmlParser {
  sParser: SimpleHtmlParser;
  parent: VNode | null = null;
  root: VNode | null = null;
  nodeStack: VNode[] = [];
  constructor() {
    this.handleStartElement = this.handleStartElement.bind(this);
    this.handleEndElement = this.handleEndElement.bind(this);
    let hanler = {
      startElement: this.handleStartElement,
      endElement: this.handleEndElement
    };
    this.sParser = new SimpleHtmlParser(hanler);
  }
  handleStartElement(sTag: string, attrs: IAttr[]) {
    let node = new VNode(sTag, attrs);
    if (this.root === null) {
      this.root = node;
    } else {
      this.parent = this.nodeStack[this.nodeStack.length - 1];
      this.parent.addChild(node);
      node.parent = this.parent;
    }
    this.nodeStack.push(node);
  }
  handleEndElement(sTag: string) {
    this.nodeStack.pop();
  }
  parse(html: string) {
    this.clearData();
    this.sParser.parse(html);
    return this.root;
  }
  clearData() {
    this.parent = null;
    this.root = null;
    this.nodeStack = [];
  }
}
