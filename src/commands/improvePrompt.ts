import * as vscode from "vscode";
import { PromptImprover } from "../services/promptImprover";
import type { ImprovePromptInput, ImprovePromptResult } from "../types";
import { looksLikeCode } from "../utils/promptClassifier";
import { getSettings } from "../utils/settings";
import { getActiveSelectionText, replaceActiveSelection } from "../utils/selection";
import { formatTokenTradeoff } from "../utils/tokenEstimate";
import { getApiKey, setApiKey } from "./keyManagement";
import { openPreview } from "./preview";

const improver = new PromptImprover();

type ResultAction = "copy" | "replace" | "preview" | "cancel";

export async function improveSelectedPrompt(context: vscode.ExtensionContext): Promise<void> {
  const selectionText = getActiveSelectionText();
  if (!selectionText) {
    return improvePromptFromInput(context);
  }

  if (looksLikeCode(selectionText)) {
    const instruction = await vscode.window.showInputBox({
      title: "Prompt Saver",
      prompt: "What should the coding agent do with this selected code?",
      ignoreFocusOut: true
    });

    if (!instruction) {
      return;
    }

    return runImproveFlow(context, {
      rawPrompt: instruction,
      selectedCode: selectionText
    });
  }

  return runImproveFlow(context, {
    rawPrompt: selectionText
  });
}

export async function improveClipboardPrompt(context: vscode.ExtensionContext): Promise<void> {
  const clipboardText = (await vscode.env.clipboard.readText()).trim();
  if (!clipboardText) {
    vscode.window.showWarningMessage("Prompt Saver: Clipboard is empty.");
    return;
  }

  await runImproveFlow(context, {
    rawPrompt: clipboardText
  });
}

export async function improvePromptFromInput(context: vscode.ExtensionContext): Promise<void> {
  const input = await vscode.window.showInputBox({
    title: "Prompt Saver",
    prompt: "What do you want the coding agent to do?",
    ignoreFocusOut: true
  });

  if (!input) {
    return;
  }

  await runImproveFlow(context, {
    rawPrompt: input
  });
}

export async function improveAndCopy(context: vscode.ExtensionContext): Promise<void> {
  const result = await improveFromSelectionOrInput(context);
  if (result) {
    await vscode.env.clipboard.writeText(result.improvedPrompt);
    vscode.window.showInformationMessage("Prompt Saver: Improved prompt copied.");
  }
}

export async function improveAndReplaceSelection(context: vscode.ExtensionContext): Promise<void> {
  const result = await improveFromSelectionOrInput(context);
  if (result) {
    const replaced = await replaceActiveSelection(result.improvedPrompt);
    if (!replaced) {
      await vscode.env.clipboard.writeText(result.improvedPrompt);
      vscode.window.showInformationMessage("Prompt Saver: No active selection. Improved prompt copied instead.");
    }
  }
}

async function improveFromSelectionOrInput(context: vscode.ExtensionContext): Promise<ImprovePromptResult | undefined> {
  const selectionText = getActiveSelectionText();
  const rawPrompt = selectionText ?? await vscode.window.showInputBox({
    title: "Prompt Saver",
    prompt: "What do you want the coding agent to do?",
    ignoreFocusOut: true
  });

  if (!rawPrompt) {
    return undefined;
  }

  return improveOnly(context, {
    rawPrompt
  });
}

async function runImproveFlow(context: vscode.ExtensionContext, input: ImprovePromptInput): Promise<void> {
  const result = await improveOnly(context, input);
  if (!result) {
    return;
  }

  const settings = getSettings();
  if (settings.autoCopyImprovedPrompt) {
    await vscode.env.clipboard.writeText(result.improvedPrompt);
  }

  if (settings.showPreviewAfterCompile) {
    await openPreview(result);
  }

  const action = await showResultActions(result);
  switch (action) {
    case "copy":
      await vscode.env.clipboard.writeText(result.improvedPrompt);
      vscode.window.showInformationMessage("Prompt Saver: Improved prompt copied.");
      break;
    case "replace":
      if (!(await replaceActiveSelection(result.improvedPrompt))) {
        vscode.window.showWarningMessage("Prompt Saver: No active selection to replace.");
      }
      break;
    case "preview":
      await openPreview(result);
      break;
    case "cancel":
    case undefined:
      break;
  }
}

async function improveOnly(context: vscode.ExtensionContext, input: ImprovePromptInput): Promise<ImprovePromptResult | undefined> {
  const settings = getSettings();
  const apiKey = await getApiKey(context, settings.provider);
  if (!apiKey) {
    const action = await vscode.window.showWarningMessage(
      `Prompt Saver needs a ${settings.provider} API key before it can improve prompts.`,
      "Set API Key",
      "Cancel"
    );

    if (action === "Set API Key") {
      await setApiKey(context, settings.provider);
    }

    return undefined;
  }

  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Prompt Saver is improving your prompt...",
      cancellable: false
    },
    async () => {
      try {
        return await improver.improve(
          {
            ...input,
            outputStyle: settings.defaultOutputStyle
          },
          settings,
          apiKey
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error.";
        vscode.window.showErrorMessage(`Prompt Saver failed: ${message}`);
        return undefined;
      }
    }
  );
}

async function showResultActions(result: ImprovePromptResult): Promise<ResultAction | undefined> {
  const settings = getSettings();
  const detail = settings.showTokenEstimate ? formatTokenSummary(result) : undefined;
  const selected = await vscode.window.showInformationMessage(
    "Improved prompt ready. Would you rather send this?",
    { modal: false, detail },
    "Copy Improved Prompt",
    "Replace Selection",
    "Open Preview",
    "Cancel"
  );

  switch (selected) {
    case "Copy Improved Prompt":
      return "copy";
    case "Replace Selection":
      return "replace";
    case "Open Preview":
      return "preview";
    case "Cancel":
      return "cancel";
    default:
      return undefined;
  }
}

function formatTokenSummary(result: ImprovePromptResult): string {
  const change = result.estimatedTokensAfter - result.estimatedTokensBefore;
  const sign = change >= 0 ? "+" : "";

  return [
    `Before: ${result.estimatedTokensBefore} tokens`,
    `After: ${result.estimatedTokensAfter} tokens`,
    `Change: ${sign}${change} tokens`,
    formatTokenTradeoff(result.tokenTradeoffLabel)
  ].join(" | ");
}
