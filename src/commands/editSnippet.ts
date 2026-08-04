import * as vscode from "vscode";
import { Snippet } from "../Models";
import { TreeItem } from "../Utils/TreeItem";
import { showTagSelector } from "../Utils/tagSelector";

export async function editSnippet(
  context: vscode.ExtensionContext,
  item: TreeItem,
) {
  if (!item || !item.label) {
    return;
  }

  const snippets: Snippet[] =
    context.globalState.get<Snippet[]>("mySnippets") || [];

  const snippetIndex = snippets.findIndex(
    (snippet) => snippet.name === item.label,
  );
  if (snippetIndex === -1) {
    vscode.window.showErrorMessage("No se encontró el snippet para editar.");
    return;
  }

  const currentSnippet = snippets[snippetIndex];
  const newName = await vscode.window.showInputBox({
    prompt: "Ingresa el nuevo nombre del snippet",
    value: currentSnippet.name,
    validateInput: (value) => {
      if (value.trim() === "") {
        return "El nombre del snippet no está vacío";
      }
      return null;
    },
  });

  if (!newName) {
    return;
  }

  const newTags = await showTagSelector(context, currentSnippet.tag);

  if (!newTags) return;

  const newDescription = await vscode.window.showInputBox({
    prompt: "Ingresa la nueva descripción del snippet",
    value: currentSnippet.description || "",
  });

  if (newDescription === undefined) return;

  snippets[snippetIndex] = {
    ...currentSnippet,
    name: newName.trim(),
    tag: newTags,
    description: newDescription.trim(),
  };

  await context.globalState.update("mySnippets", snippets);
  vscode.window.showInformationMessage(
    `Snippet "${newName}" actualizado correctamente.`,
  );
}
