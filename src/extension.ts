import * as vscode from "vscode";
import {
  improveAndCopy,
  improveAndReplaceSelection,
  improveClipboardPrompt,
  improvePromptFromInput,
  improveSelectedPrompt
} from "./commands/improvePrompt";
import { deleteApiKey, setApiKey } from "./commands/keyManagement";
import type { ProviderId } from "./types";
import { getSettings } from "./utils/settings";

export function activate(context: vscode.ExtensionContext): void {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(sparkle) Prompt Saver";
  statusBarItem.tooltip = "Improve a coding-agent prompt";
  statusBarItem.command = "promptSaver.improveFromInput";
  statusBarItem.show();

  context.subscriptions.push(
    statusBarItem,
    vscode.commands.registerCommand("promptSaver.improveSelectedPrompt", () => improveSelectedPrompt(context)),
    vscode.commands.registerCommand("promptSaver.improveClipboardPrompt", () => improveClipboardPrompt(context)),
    vscode.commands.registerCommand("promptSaver.improveFromInput", () => improvePromptFromInput(context)),
    vscode.commands.registerCommand("promptSaver.setApiKey", () => setApiKey(context, getSettings().provider)),
    vscode.commands.registerCommand("promptSaver.chooseProvider", chooseProvider),
    vscode.commands.registerCommand("promptSaver.openSettings", openSettings),
    vscode.commands.registerCommand("promptSaver.improveAndCopy", () => improveAndCopy(context)),
    vscode.commands.registerCommand("promptSaver.improveAndReplaceSelection", () => improveAndReplaceSelection(context)),
    vscode.commands.registerCommand("promptSaver.deleteApiKey", () => deleteApiKey(context, getSettings().provider))
  );
}

export function deactivate(): void {
  // No cleanup required.
}

async function chooseProvider(): Promise<void> {
  const options: Array<{ label: string; provider: ProviderId; description: string }> = [
    { label: "OpenAI", provider: "openai", description: "Implemented in the MVP" },
    { label: "Anthropic", provider: "anthropic", description: "Future provider" },
    { label: "Google Gemini", provider: "gemini", description: "Future provider" },
    { label: "OpenRouter", provider: "openrouter", description: "Future provider" },
    { label: "Local Ollama", provider: "ollama", description: "Future provider" }
  ];

  const selected = await vscode.window.showQuickPick(options, {
    title: "Prompt Saver: Choose Provider",
    placeHolder: "OpenAI is implemented in this MVP"
  });

  if (!selected) {
    return;
  }

  await vscode.workspace
    .getConfiguration("promptSaver")
    .update("provider", selected.provider, vscode.ConfigurationTarget.Global);

  vscode.window.showInformationMessage(`Prompt Saver provider set to ${selected.label}.`);
}

async function openSettings(): Promise<void> {
  await vscode.commands.executeCommand("workbench.action.openSettings", "promptSaver");
}
