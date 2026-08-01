import * as vscode from "vscode";
import { detailedSave } from "./commands/detailedSave";
import { quickSave } from "./commands/quickSave";
import { deleteSnippet } from "./commands/deleteSnippet";
import { copySnippet } from "./commands/copySnippet";
import { SnippetProvider } from "./SnippetProvider";
import { TreeItem } from "./Utils/TreeItem";


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

  let deleteSnippetCommand = vscode.commands.registerCommand(
    "my-first-extension.deleteSnippet",
    async (item: TreeItem) => {
      await deleteSnippet(context, item);
      snippetProvider.refresh();
    },
  );

  let copySnippetCommand = vscode.commands.registerCommand(
    "my-first-extension.copySnippet",
    async (item: TreeItem) => {
      await copySnippet(item);
    },
  );

  async function handleDetailedSaveWithRefresh() {
    await detailedSave(context);
    snippetProvider.refresh();
  }

  context.subscriptions.push(
    disposableQuickSave,
    disposableDetailedSave,
    insertSnippetCommand,
    deleteSnippetCommand,
    copySnippetCommand,
  );
}

export function deactivate() {}
