import * as vscode from 'vscode';
import * as fs from 'fs';
import { Snippet } from '../Models';
import { SnippetProvider } from '../SnippetProvider';

export async function exportSnippetsCommand(context: vscode.ExtensionContext) {
    const snippets: Snippet[] = context.globalState.get<Snippet[]>('mySnippets') || [];

    if (snippets.length === 0) {
        vscode.window.showWarningMessage('No hay snippets guardados para exportar.');
        return;
    }

    const fileUri = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file('mis-snippets-backup.json'),
        filters: { 'Archivos JSON': ['json'] },
        saveLabel: 'Exportar Snippets'
    });

    if (fileUri) {
        try {
            const data = JSON.stringify(snippets, null, 2);
            await fs.promises.writeFile(fileUri.fsPath, data, 'utf8');
            vscode.window.showInformationMessage('¡Biblioteca de snippets exportada con éxito!');
        } catch (error) {
            vscode.window.showErrorMessage('Error al intentar guardar el archivo JSON.');
        }
    }
}

export async function importSnippetsCommand(context: vscode.ExtensionContext, snippetProvider: SnippetProvider) {
    const fileUri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: { 'Archivos JSON': ['json'] },
        openLabel: 'Importar Snippets'
    });

    if (fileUri && fileUri[0]) {
        try {
            const content = await fs.promises.readFile(fileUri[0].fsPath, 'utf8');
            const importedSnippets: Snippet[] = JSON.parse(content);

            if (!Array.isArray(importedSnippets)) {
                throw new Error('Formato JSON no válido.');
            }

            const action = await vscode.window.showQuickPick(
                ['Fusionar (Añadir a los actuales)', 'Reemplazar (Borrar actuales y cargar estos)'],
                { placeHolder: '¿Cómo quieres importar los nuevos snippets?' }
            );

            if (!action) return;

            let currentSnippets: Snippet[] = context.globalState.get<Snippet[]>('mySnippets') || [];

            if (action.startsWith('Reemplazar')) {
                currentSnippets = importedSnippets;
            } else {
                const existingNames = new Set(currentSnippets.map(s => s.name));
                const newOnly = importedSnippets.filter(s => !existingNames.has(s.name));
                currentSnippets = [...currentSnippets, ...newOnly];
            }

            await context.globalState.update('mySnippets', currentSnippets);
            snippetProvider.refresh();
            vscode.window.showInformationMessage('¡Snippets importados correctamente!');
        } catch (error) {
            vscode.window.showErrorMessage('El archivo no tiene un formato válido de snippets.');
        }
    }
}