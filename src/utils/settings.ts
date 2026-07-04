import * as vscode from "vscode";
import type { OutputStyle, PromptSaverSettings, ProviderId } from "../types";

export function getSettings(): PromptSaverSettings {
  const config = vscode.workspace.getConfiguration("promptSaver");

  return {
    provider: config.get<ProviderId>("provider", "openai"),
    model: config.get<string>("model", "gpt-4.1-mini"),
    temperature: config.get<number>("temperature", 0.2),
    maxOutputTokens: config.get<number>("maxOutputTokens", 700),
    defaultOutputStyle: config.get<OutputStyle>("defaultOutputStyle", "structured"),
    autoCopyImprovedPrompt: config.get<boolean>("autoCopyImprovedPrompt", false),
    showTokenEstimate: config.get<boolean>("showTokenEstimate", true),
    showPreviewAfterCompile: config.get<boolean>("showPreviewAfterCompile", false)
  };
}
