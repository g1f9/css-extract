import * as vscode from "vscode";
export function getHtml() {
  let html = "";
  let from = "";
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const selections = editor.selections;
    selections.forEach(selection => {
      const text = editor.document.getText(selection);
      html += text;
    });
    if (!html) {
      let text = editor.document.getText();
      let reg = /\<template\>([\s\S]*)\<\/template>/g;
      if (reg.test(text)) {
        let matched = RegExp.$1;
        if (matched) {
          html = matched;
          from = "template";
        }
      }
    }
  }
  return {
    html,
    from
  };
}

export function matchTag(tag: string, matchString: string) {
  let reg = new RegExp("<" + tag + "([^>]*)>");
  return matchString.match(reg);
}

export function matchScssStylePos(str: string) {
  let result = matchTag("style", str);
  if (result) {
    let group = result[1];
    if (group.indexOf("scss") < 0) {
      return -1;
    }
    let len = result[0].length;
    let pos = len;
    let index = result.index;
    if (index) {
      pos = index + len;
    }
    return pos;
  }
  return -1;
}
export function clipboardWrite(text: string) {
  vscode.env.clipboard.writeText(text);
}
