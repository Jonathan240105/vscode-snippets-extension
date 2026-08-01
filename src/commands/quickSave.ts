import * as vscode from "vscode";
import { Snippet } from "../Models";
import { getSelectedText, saveToGlobalState } from "../Utils/Utils";

export async function quickSave(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;
  if (!editor){
    vscode.window.showErrorMessage("Pero abre algun archivo bro xd");
    return;
  }

  const selectedText = getSelectedText(editor);
  if (!selectedText) return;

  const name = await vscode.window.showInputBox({
    prompt: "Guardado rápido: Ponle un nombre a tu snippet",
    title: "Guardado rápido",
  });

  if(name){
    const newSnippet : Snippet = {
        id : Date.now().toString(),
        name: name,
        code: selectedText,
        language: editor.document.languageId,
        tag: ["General"],
        description: "Guardado rápido",
        date: new Date().toLocaleDateString()
    };

     await saveToGlobalState(context, newSnippet);
  }else{
    vscode.window.showErrorMessage("No se proporcionó un nombre para el snippet. Guardado cancelado.");
  }

}
