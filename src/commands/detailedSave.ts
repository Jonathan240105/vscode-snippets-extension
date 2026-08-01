import * as vscode from "vscode";
import { Snippet } from "../Models";
import { getSelectedText, saveToGlobalState } from "../Utils/Utils";
import { showTagSelector } from "../Utils/tagSelector";

export async function detailedSave(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("Pero abre algun archivo bro xd");
    return;
  }

  const selectedText = getSelectedText(editor);
  if (!selectedText) return;

  const name = await vscode.window.showInputBox({
    prompt: "Guardado detallado: Ponle un nombre a tu snippet",
    title: "Guardado detallado",
  });

  if (!name) return;

  const tagsArray = await showTagSelector(context);
  if (!tagsArray) return;

  const description =
    (await vscode.window.showInputBox({
      prompt: "Ingresa una descripción para tu snippet (opcional)",
      placeHolder: "Ej: Este snippet se encarga de la seguridad del token",
    })) || "";

  const newSnippet: Snippet = {
    id: Date.now().toString(),
    name: name,
    code: selectedText,
    language: editor.document.languageId,
    tag: tagsArray.length > 0 ? tagsArray : ["General"],
    description: description,
    date: new Date().toLocaleDateString(),
  };

  await saveToGlobalState(context, newSnippet);
}
