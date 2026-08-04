import * as vscode from 'vscode';
import {TreeItem} from "../Utils/TreeItem";

export async function copySnippet(item : TreeItem){
    if(item && item.code){
        await vscode.env.clipboard.writeText(item.code);
        vscode.window.showInformationMessage(`Snippet ${item.label} copiado al portapapeles`);
    }
}