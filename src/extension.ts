import * as vscode from "vscode";
import HtmlParser from "./parser/HtmlParser";
import ScssPrinter from "./printer/ScssPrinter";
import { getHtml, matchScssStylePos, clipboardWrite } from "./utils";
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.extractCSS",
    () => {
      // The code you place here will be executed every time your command is executed
      const editor = vscode.window.activeTextEditor;
      let parser = new HtmlParser();
      let printer = new ScssPrinter();
      let result = getHtml();
      if (result.html) {
        let scssStr = "";
        let node = parser.parse(result.html);
        if (node) {
          scssStr = printer.print(node);
        }
        if (result.from === "template") {
          if (editor) {
            let text = editor.document.getText();
            let posNum = matchScssStylePos(text);
            let startTag = "\n";
            let endTag = "\n";
            if (posNum < 0) {
              posNum = text.length;
              startTag += '<style lang="scss" scoped>' + "\n";
              endTag += "</style>";
            }
            let pos = editor.document.positionAt(posNum);
            editor.edit(editBuilder => {
              editBuilder.insert(pos, startTag + scssStr + endTag);
            });
          }
        } else {
          clipboardWrite(scssStr);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
