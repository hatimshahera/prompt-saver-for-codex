import * as vscode from "vscode";
import type { ProviderId } from "../types";

export function getSecretKeyName(provider: ProviderId): string {
  return `promptSaver.${provider}.apiKey`;
}

export async function getApiKey(context: vscode.ExtensionContext, provider: ProviderId): Promise<string | undefined> {
  return context.secrets.get(getSecretKeyName(provider));
}

export async function setApiKey(context: vscode.ExtensionContext, provider: ProviderId): Promise<void> {
  const key = await vscode.window.showInputBox({
    title: "Prompt Saver: Set API Key",
    prompt: `Enter your ${provider} API key. It will be stored in VS Code SecretStorage.`,
    password: true,
    ignoreFocusOut: true,
    validateInput: (value) => value.trim().length < 8 ? "Enter a valid API key." : undefined
  });

  if (!key) {
    return;
  }

  await context.secrets.store(getSecretKeyName(provider), key.trim());
  vscode.window.showInformationMessage(`Prompt Saver ${provider} API key saved in SecretStorage.`);
}

export async function deleteApiKey(context: vscode.ExtensionContext, provider: ProviderId): Promise<void> {
  await context.secrets.delete(getSecretKeyName(provider));
  vscode.window.showInformationMessage(`Prompt Saver ${provider} API key deleted.`);
}
