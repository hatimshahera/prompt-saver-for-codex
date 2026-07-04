# Lesson: Prompt Saver for Codex

## What I built

A small BYOK VS Code extension that improves rough developer prompts before they are sent to Codex or another coding agent.

## What I learned

The useful product boundary is the human instruction layer. Codex, Claude Code, Cursor, and Copilot Chat already handle project context in their own ways, so this extension should not try to become a heavyweight context manager.

## What was harder than expected

The main design challenge was keeping the workflow tiny while still making the output useful. A bigger dashboard would add friction; native VS Code UI keeps the tool close to the moment where the developer writes the prompt.

## What I would improve

- Add Anthropic, Gemini, OpenRouter, and Ollama providers.
- Add optional project-specific prompt rules.
- Add optional prompt history only if users explicitly enable it.
- Explore best-effort integration with chat extensions that expose insertion commands.

## Skills used

- VS Code Extension API
- TypeScript
- SecretStorage
- Prompt design
- BYOK provider architecture
- Developer workflow design

## Possible future version

A published marketplace extension with multi-provider support, optional local Ollama mode, and per-workspace prompt style rules.
