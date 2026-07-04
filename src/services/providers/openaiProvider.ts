import type { PromptProvider, ProviderRequest } from "../../types";

type OpenAIChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export class OpenAIProvider implements PromptProvider {
  async improvePrompt(request: ProviderRequest): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${request.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: request.model,
        temperature: request.temperature,
        max_tokens: request.maxOutputTokens,
        messages: [
          {
            role: "system",
            content: request.systemPrompt
          },
          {
            role: "user",
            content: request.userPrompt
          }
        ]
      })
    });

    const data = (await response.json()) as OpenAIChatResponse;

    if (!response.ok) {
      throw new Error(data.error?.message ?? `OpenAI request failed with HTTP ${response.status}.`);
    }

    const improvedPrompt = data.choices?.[0]?.message?.content?.trim();
    if (!improvedPrompt) {
      throw new Error("OpenAI returned an empty prompt.");
    }

    return improvedPrompt;
  }
}
