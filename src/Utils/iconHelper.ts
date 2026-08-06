import * as vscode from 'vscode';

const CATEGORY_ICONS: Record<string, string> = {
    'FrontEnd': 'layout',
    'BackEnd': 'server',
    'Seguridad': 'shield',
    'BBDD': 'database',
    'Utilidades': 'tools',
    'General': 'archive',
    'Token': 'key'
};

const LANGUAGE_ICONS: Record<string, string> = {
    'html': 'symbol-structure',
    'css': 'paintcan',
    'javascript': 'symbol-method',
    'js': 'symbol-method',
    'typescript': 'symbol-method',
    'ts': 'symbol-method',
    'json': 'json',
    'java': 'symbol-class',
    'c': 'symbol-keyword',
    'cpp': 'symbol-operator',
    'c++': 'symbol-operator',
    'csharp': 'symbol-interface',
    'c#': 'symbol-interface',
    'python': 'symbol-variable',
    'py': 'symbol-variable',
    'sql': 'database',
    'markdown': 'markdown',
    'md': 'markdown',
    'php': 'symbol-event',
    'ruby': 'gem',
    'go': 'symbol-misc',
    'rust': 'tools',
    'shell': 'terminal',
    'bash': 'terminal'
};

export function getCategoryIcon(categoryName: string): vscode.ThemeIcon {
    const icon = CATEGORY_ICONS[categoryName] || 'folder';
    return new vscode.ThemeIcon(icon);
}

export function getSnippetIcon(language: string = ''): vscode.ThemeIcon {
    const icon = LANGUAGE_ICONS[language.toLowerCase()] || 'file-code';
    return new vscode.ThemeIcon(icon);
}