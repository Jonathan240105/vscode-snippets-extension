import * as vscode from "vscode";
import { detailedSave } from "./commands/detailedSave";
import { quickSave } from "./commands/quickSave";
import { SnippetProvider } from "./SnippetProvider";

export function activate(context: vscode.ExtensionContext) {
  const snippetProvider = new SnippetProvider(context);

  vscode.window.registerTreeDataProvider("mySnippetsExplorer", snippetProvider);

  let insertSnippetCommand = vscode.commands.registerCommand(
    "my-first-extension.insertSnippet",
    (code: string) => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        editor.insertSnippet(new vscode.SnippetString(code));
      }
    },
  );

  let disposableQuickSave = vscode.commands.registerCommand(
    "my-first-extension.quickSave",
    async () => {
      await quickSave(context);
      snippetProvider.refresh();
    },
  );

  let disposableDetailedSave = vscode.commands.registerCommand(
    "my-first-extension.detailedSave",
    async () => {
      await handleDetailedSaveWithRefresh();
    },
  );

  async function handleDetailedSaveWithRefresh() {
    await detailedSave(context);
    snippetProvider.refresh();
  }

  context.subscriptions.push(disposableQuickSave, disposableDetailedSave, insertSnippetCommand);
}

export function deactivate() {}
