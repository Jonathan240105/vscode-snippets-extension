import * as vscode from "vscode";
import { Snippet } from "../Models";

export async function searchSnippet(context: vscode.ExtensionContext) {
  const snippets: Snippet[] =
    context.globalState.get<Snippet[]>("mySnippets") || [];

  if (snippets.length === 0) {
    vscode.window.showInformationMessage(
      "No tienes snippets guardados. Por favor, guarda algunos snippets primero.",
    );
  }

  const quickPickItems = snippets.map((snippet) => {
    const tagsFormatted =
      snippet.tag && snippet.tag.length > 0
        ? snippet.tag.map((t) => `#${t}`).join(" ")
        : "#General";

    return {
      label: `$(code) ${snippet.name}`,
      description: `${tagsFormatted} [${snippet.language || "texto"}]`,
      detail: snippet.description || snippet.code.trim().replace(/\n/g, " "),
      snippetCode: snippet.code,
    };
  });

  const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
    placeHolder: "Escribe para buscar por nombre, #tag o contenido...",
    matchOnDescription: true,
    matchOnDetail: true,
  });

  if (selectedItem) {
    await vscode.commands.executeCommand(
      "my-first-extension.insertSnippet",
      selectedItem.snippetCode,
    );
  }
}
