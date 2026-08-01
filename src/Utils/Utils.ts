import * as vscode from "vscode";
import { Snippet } from "../Models";

export function getSelectedText(editor: vscode.TextEditor): string | null {

    const selection = editor.selection;
    const text = editor.document.getText(selection);

    if(text.trim() === "") {
        vscode.window.showErrorMessage("No has seleccionado nada bro");
    }
  return text;
}


export async function saveToGlobalState(context : vscode.ExtensionContext,snippet: Snippet ){
  
  const currentSnipets: Snippet[] = context.globalState.get<Snippet[]>('mySnippets') || [];
  currentSnipets.push(snippet);
  await context.globalState.update('mySnippets', currentSnipets);
  vscode.window.showInformationMessage(`Snippet "${snippet.name}" guardado correctamente`);
}