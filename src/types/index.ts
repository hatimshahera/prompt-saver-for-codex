export type PromptMode = "auto" | "build" | "debug" | "refactor" | "test" | "review" | "compress";

export type ProviderId = "openai" | "anthropic" | "gemini" | "openrouter" | "ollama";

export type OutputStyle = "structured" | "concise";

export type TokenTradeoffLabel = "shorter" | "longer-but-clearer" | "same-length-better";

export type ImprovePromptInput = {
  rawPrompt: string;
  mode?: PromptMode;
  activeFilePath?: string;
  languageId?: string;
  selectedCode?: string;
  outputStyle?: OutputStyle;
};

export type ImprovePromptResult = {
  originalPrompt: string;
  improvedPrompt: string;
  estimatedTokensBefore: number;
  estimatedTokensAfter: number;
  tokenTradeoffLabel: TokenTradeoffLabel;
};

export type PromptSaverSettings = {
  provider: ProviderId;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  defaultOutputStyle: OutputStyle;
  autoCopyImprovedPrompt: boolean;
  showTokenEstimate: boolean;
  showPreviewAfterCompile: boolean;
};

export type ProviderRequest = {
  systemPrompt: string;
  userPrompt: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  apiKey: string;
};

export interface PromptProvider {
  improvePrompt(request: ProviderRequest): Promise<string>;
}
