export type IAttr = {
  name: string;
  value: string | null;
};
export type IParseHandler = {
  startElement?: (sTag: string, attrs: IAttr[]) => void;
  endElement?: (sTag: string) => void;
  characters?: (s: string) => void;
  comment?: (s: string) => void;
};
export default class SimpleHtmlParser {
  startTagRe = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m;
  endTagRe = /^<\/([^>\s]+)[^>]*>/m;
  attrRe = /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm;
  contentHandler: IParseHandler;
  constructor(parseHandler: IParseHandler) {
    this.contentHandler = parseHandler;
  }
  parse(s: string) {
    let i = 0;
    let res, lc, lm, rc, index;
    let treatAsChars = false;
    let oThis = this;
    while (s.length > 0) {
      // Comment
      if (s.substring(0, 4) == "<!--") {
        index = s.indexOf("-->");
        if (index != -1) {
          if (this.contentHandler.comment) {
            this.contentHandler.comment(s.substring(4, index));
          }
          s = s.substring(index + 3);
          treatAsChars = false;
        } else {
          treatAsChars = true;
        }
      }

      // end tag
      else if (s.substring(0, 2) == "</") {
        if (this.endTagRe.test(s)) {
          lc = (RegExp as any).leftContext;
          lm = (RegExp as any).lastMatch;
          rc = (RegExp as any).rightContext;

          lm.replace(this.endTagRe, function(full: string, group1: string) {
            return oThis.parseEndTag.apply(oThis, [full, group1]);
          });

          s = rc;
          treatAsChars = false;
        } else {
          treatAsChars = true;
        }
      }
      // start tag
      else if (s.charAt(0) == "<") {
        if (this.startTagRe.test(s)) {
          lc = (RegExp as any).leftContext;
          lm = (RegExp as any).lastMatch;
          rc = (RegExp as any).rightContext;

          lm.replace(this.startTagRe, function() {
            return oThis.parseStartTag.apply(oThis, arguments as any);
          });

          s = rc;
          treatAsChars = false;
        } else {
          treatAsChars = true;
        }
      }

      if (treatAsChars) {
        index = s.indexOf("<");
        if (index == -1) {
          if (this.contentHandler.characters) {
            this.contentHandler.characters(s);
          }

          s = "";
        } else {
          if (this.contentHandler.characters) {
            this.contentHandler.characters(s.substring(0, index));
          }

          s = s.substring(index);
        }
      }

      treatAsChars = true;
    }
  }
  parseStartTag(sTag: string, sTagName: string, sRest: any) {
    let attrs = this.parseAttributes(sTagName, sRest);
    if (this.contentHandler.startElement) {
      this.contentHandler.startElement(sTagName, attrs);
    }
  }

  parseEndTag(sTag: string, sTagName: string) {
    if (this.contentHandler.endElement) {
      this.contentHandler.endElement(sTagName);
    }
  }

  parseAttributes(sTagName: string, s: string) {
    let oThis = this;
    let attrs: IAttr[] = [];
    s.replace(this.attrRe, function(
      a0: string,
      a1: any,
      a2: any,
      a3: any,
      a4: any,
      a5: any,
      a6: any
    ) {
      attrs.push(oThis.parseAttribute(sTagName, a0, a1, a2, a3, a4, a5, a6));
      return "";
    });
    return attrs;
  }

  parseAttribute(sTagName: any, sAttribute: any, sName: any, ...args: any[]) {
    var value = "";
    if (arguments[7]) {
      value = arguments[8];
    } else if (arguments[5]) {
      value = arguments[6];
    } else if (arguments[3]) {
      value = arguments[4];
    }

    var empty = !value && !arguments[3];
    return { name: sName, value: empty ? null : value };
  }
}
