import * as vscode from "vscode";

export function getActiveSelectionText(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.selection.isEmpty) {
    return undefined;
  }

  return editor.document.getText(editor.selection);
}

export function getEditorContext(): { activeFilePath?: string; languageId?: string } {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return {};
  }

  return {
    activeFilePath: vscode.workspace.asRelativePath(editor.document.uri, false),
    languageId: editor.document.languageId
  };
}

export async function replaceActiveSelection(text: string): Promise<boolean> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.selection.isEmpty) {
    return false;
  }

  return editor.edit((editBuilder) => {
    editBuilder.replace(editor.selection, text);
  });
}
