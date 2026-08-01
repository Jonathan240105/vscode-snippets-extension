import * as vscode from "vscode";
import { Snippet } from "../Models";
import { TreeItem } from "../Utils/TreeItem";

export async function deleteSnippet(context: vscode.ExtensionContext,item: TreeItem,) {
  if (!item || !item.label) {
    return;
  }

  const confirm = await vscode.window.showWarningMessage(
    `Estás seguro de eliminar el snippet "${item.label}"?`,
    { modal: true },
    "Eliminar",
  );

  if(confirm ==="Eliminar"){

    const snippets: Snippet[] = context.globalState.get<Snippet[]>('mySnippets') || [];

    const updatedSnippets = snippets.filter(snippet => snippet.name !== item.label);

    await context.globalState.update('mySnippets', updatedSnippets);
    vscode.window.showInformationMessage(`Snippet ${item.label} eliminado correctamente`);
    
  }
}
