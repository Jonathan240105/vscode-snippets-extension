import * as vscode from "vscode";
import {getCategoryIcon, getSnippetIcon} from "./iconHelper";

export class TreeItem extends vscode.TreeItem {
    
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly isFolder: boolean,
    public readonly code?: string,
    public readonly desc?: string,
    public readonly language?: string
  ) {
    super(label, collapsibleState);

    if (this.isFolder) {
      this.iconPath = getCategoryIcon(this.label);
      this.contextValue = "folder";

    } else {
      this.iconPath = getSnippetIcon(this.language);
      this.contextValue = "snippet";

      if(this.language){
        this.description = `[${this.language}]`;
      }


      const tooltipmarkdown = new vscode.MarkdownString();

      if (this.desc) {
        tooltipmarkdown.appendMarkdown(`*${this.desc}*\n\n---\n\n`);
      }
      tooltipmarkdown.appendCodeblock(this.code || "", this.language || "");
      this.tooltip = tooltipmarkdown;
    }
  }
}
