import * as vscode from "vscode";
import { Snippet } from "../Models";

export async function showTagSelector(context: vscode.ExtensionContext, initialTags: string[] = []) {
  const currentSnippets: Snippet[] =
    context.globalState.get("mySnippets") || [];
  const existingTags = new Set<string>([
    "FrontEnd",
    "BackEnd",
    "Seguridad",
    "DDBB",
    "General",
    "Utilidades",
  ]);

  currentSnippets.forEach((snippet) =>
    snippet.tag.forEach((tag) => existingTags.add(tag)),
  );

  const quickPickItems: vscode.QuickPickItem[] = Array.from(existingTags).map(
    (tag) => ({
      label: tag,
      description: "Categoría existente",
      picked: initialTags.includes(tag),
    }),
  );

  quickPickItems.push({
    label: "$(plus) Nueva categoría",
    alwaysShow: true,
  });

  const selectedTags = await vscode.window.showQuickPick(quickPickItems, {
    prompt:
      "Selecciona una o varias categorías para tu snippet o crea una nueva",
    canPickMany: true,
  });

  if (!selectedTags) return null;

  let finalTags: string[] = [];

  const wantsToAddNewTag = selectedTags.some((tag) =>
    tag.label.includes("Nueva categoría"),
  );

  if (wantsToAddNewTag) {
    const newTagInput = await vscode.window.showInputBox({
      prompt: "Escribe el nombre de la nueva categoría",
      placeHolder: "Ej: Seguridad, DDBB, FrontEnd",
    });

    if (newTagInput && newTagInput.trim().length > 0) {
      finalTags.push(newTagInput.trim());
    }
  }

  selectedTags.forEach((tag) => {
    if (!tag.label.includes("Nueva categoría")) {
      finalTags.push(tag.label);
    }
  });

  if (finalTags.length === 0) {
    finalTags = ["General"];
  }

  return finalTags;
}
