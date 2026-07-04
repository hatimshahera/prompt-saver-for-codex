import type {
  ImprovePromptInput,
  ImprovePromptResult,
  PromptProvider,
  PromptSaverSettings,
  ProviderId
} from "../types";
import { inferMode } from "../utils/promptClassifier";
import { estimateTokens, getTokenTradeoffLabel } from "../utils/tokenEstimate";
import { OpenAIProvider } from "./providers/openaiProvider";

const systemPrompt = `You are a prompt compiler for AI coding agents such as Codex, Claude Code, Cursor, Copilot Chat, and Windsurf.

Rewrite the user's rough developer instruction into a clearer, more token-aware, paste-ready coding-agent prompt.

Optimise for:
- clear task definition
- useful constraints
- minimal ambiguity
- small safe changes
- reduced follow-up messages
- acceptance criteria where useful

Rules:
- Preserve the user's intent.
- Do not invent file names, APIs, libraries, bugs, or project details.
- Do not add unnecessary context.
- Do not mention editor metadata, active files, environment files, or workspace details unless the user explicitly provided that context in the prompt or selected content.
- Keep the prompt concise.
- If the original prompt is vague, add reasonable generic structure but label assumptions clearly.
- Do not explain what you are doing.
- Return only the improved prompt.`;

export class PromptImprover {
  private readonly providers: Record<ProviderId, PromptProvider | undefined> = {
    openai: new OpenAIProvider(),
    anthropic: undefined,
    gemini: undefined,
    openrouter: undefined,
    ollama: undefined
  };

  async improve(input: ImprovePromptInput, settings: PromptSaverSettings, apiKey: string): Promise<ImprovePromptResult> {
    const provider = this.providers[settings.provider];
    if (!provider) {
      throw new Error(`${settings.provider} is listed for future support, but only OpenAI is implemented in this MVP.`);
    }

    const originalPrompt = input.rawPrompt.trim();
    const estimatedTokensBefore = estimateTokens(originalPrompt);
    const improvedPrompt = await provider.improvePrompt({
      systemPrompt,
      userPrompt: this.buildUserPrompt(input),
      model: settings.model,
      temperature: settings.temperature,
      maxOutputTokens: settings.maxOutputTokens,
      apiKey
    });
    const estimatedTokensAfter = estimateTokens(improvedPrompt);

    return {
      originalPrompt,
      improvedPrompt,
      estimatedTokensBefore,
      estimatedTokensAfter,
      tokenTradeoffLabel: getTokenTradeoffLabel(estimatedTokensBefore, estimatedTokensAfter)
    };
  }

  private buildUserPrompt(input: ImprovePromptInput): string {
    const mode = input.mode === "auto" || !input.mode ? inferMode(input.rawPrompt) : input.mode;
    const lines = [
      `Rewrite mode: ${mode}`,
      `Output style: ${input.outputStyle ?? "structured"}`,
      "",
      "Raw user instruction:",
      input.rawPrompt.trim()
    ];

    if (input.selectedCode) {
      lines.push("", "Selected code/content supplied by user:", input.selectedCode.trim());
    }

    lines.push(
      "",
      "Return a paste-ready prompt. Use this structure when it helps:",
      "Task:",
      "Context:",
      "Instructions:",
      "Constraints:",
      "Acceptance criteria:"
    );

    return lines.filter((line): line is string => line !== undefined).join("\n");
  }
}
