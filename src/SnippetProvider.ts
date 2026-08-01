import * as vscode from "vscode";
import { Snippet } from "./Models";
import { TreeItem } from "./Utils/TreeItem";

export class SnippetProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeItem | undefined | null | void
  > = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    TreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    const snippets: Snippet[] =
      this.context.globalState.get<Snippet[]>("mySnippets") || [];

    if (!element) {
      const allTags = snippets.reduce((acc: string[], snippet) => {
        return acc.concat(snippet.tag || []);
      }, []);

      const uniqueTags = Array.from(new Set(allTags));

      if (uniqueTags.length === 0) {
        return [
          new TreeItem(
            "No hay snippets guardados",
            vscode.TreeItemCollapsibleState.None,
            false,
          ),
        ];
      }

      return uniqueTags.map(
        (tag) =>
          new TreeItem(tag, vscode.TreeItemCollapsibleState.Collapsed, true),
      );
    }

    if (element.isFolder) {
      const filteredSnippets = snippets.filter((snippet) =>
        snippet.tag.includes(element.label),
      );

      return filteredSnippets.map((s) => {
        const item = new TreeItem(
          s.name,
          vscode.TreeItemCollapsibleState.None,
          false,
          s.code,
          s.description,
        );

        item.command = {
          command: "my-first-extension.insertSnippet",
          title: "Insertar Snippet",
          arguments: [s.code],
        };

        item.description = `[${s.language}]`;
        return item;
      });
    }
    return [];
  }
}
