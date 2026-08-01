import * as vscode from "vscode";

export class TreeItem extends vscode.TreeItem {
    
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly isFolder: boolean,
    public readonly code?: string,
    public readonly desc?: string,
  ) {
    super(label, collapsibleState);

    if (this.isFolder) {
      this.iconPath = new vscode.ThemeIcon("folder");
      this.contextValue = "folder";

    } else {

      this.iconPath = new vscode.ThemeIcon("code");
      this.contextValue = "snippet";

      const tooltipmarkdown = new vscode.MarkdownString();

      if (this.desc) {
        tooltipmarkdown.appendMarkdown(`*${this.desc}*\n\n---\n\n`);
      }
      tooltipmarkdown.appendCodeblock(this.code || "", "");
      this.tooltip = tooltipmarkdown;
    }
  }
}
