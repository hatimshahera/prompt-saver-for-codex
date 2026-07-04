import * as vscode from "vscode";
import type { ImprovePromptResult } from "../types";
import { formatTokenTradeoff } from "../utils/tokenEstimate";

export async function openPreview(result: ImprovePromptResult): Promise<void> {
  const markdown = buildPreviewMarkdown(result);
  const document = await vscode.workspace.openTextDocument({
    content: markdown,
    language: "markdown"
  });
  await vscode.window.showTextDocument(document, { preview: true, viewColumn: vscode.ViewColumn.Beside });
}

function buildPreviewMarkdown(result: ImprovePromptResult): string {
  const change = result.estimatedTokensAfter - result.estimatedTokensBefore;
  const sign = change >= 0 ? "+" : "";

  return `# Prompt Saver Preview

## Token Estimate

- Before: ${result.estimatedTokensBefore} tokens
- After: ${result.estimatedTokensAfter} tokens
- Change: ${sign}${change} tokens
- Tradeoff: ${formatTokenTradeoff(result.tokenTradeoffLabel)}

## Original Prompt

\`\`\`text
${result.originalPrompt}
\`\`\`

## Improved Prompt

\`\`\`text
${result.improvedPrompt}
\`\`\`
`;
}
