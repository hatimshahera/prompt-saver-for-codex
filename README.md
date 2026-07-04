# Tool 05: Prompt Saver for Codex

Day 5 of 60 AI Tools in 60 Days.

Prompt Saver for Codex is a BYOK VS Code extension that rewrites rough developer prompts into clear, token-aware instructions for Codex, Claude Code, Cursor, Copilot Chat, and other coding agents.

## Problem it solves

Coding agents often fail because the human instruction is vague:

```text
fix the auth bug
make dashboard better
clean this up
add tests here
why is this failing
```

Prompt Saver improves that instruction layer before you send the prompt. It does not scan your repo, replace Codex context, or store prompt history.

## Features

- Improve selected prompt text with one shortcut.
- Improve clipboard text.
- Improve a prompt from a VS Code input box.
- Use only the prompt text as context unless the user explicitly selects code/content.
- Copy the improved prompt.
- Replace the current selection.
- Open a simple markdown preview.
- Estimate before/after prompt tokens using `characters / 4`.
- Store API keys in VS Code SecretStorage.
- Use OpenAI as the MVP provider.
- Keep provider code ready for Anthropic, Gemini, OpenRouter, and Ollama later.

## Commands

- `Prompt Saver: Improve Selected Prompt`
- `Prompt Saver: Improve Clipboard Prompt`
- `Prompt Saver: Improve Prompt from Input Box`
- `Prompt Saver: Set API Key`
- `Prompt Saver: Delete API Key`
- `Prompt Saver: Choose Provider`
- `Prompt Saver: Open Settings`
- `Prompt Saver: Improve and Copy`
- `Prompt Saver: Improve and Replace Selection`

## Shortcut

- macOS: `Cmd+Alt+P`
- Windows/Linux: `Ctrl+Alt+P`

If no text is selected, the extension opens an input box asking:

```text
What do you want the coding agent to do?
```

## How it works

1. Select a rough prompt in VS Code.
2. Run `Prompt Saver: Improve Selected Prompt`.
3. Prompt Saver sends only that selected/input text to your chosen provider.
4. VS Code shows: `Improved prompt ready. Would you rather send this?`
5. Choose `Copy Improved Prompt`, `Replace Selection`, `Open Preview`, or `Cancel`.

If the selected text looks like code, Prompt Saver asks what you want the coding agent to do with that code before improving the prompt.

## Example

Raw:

```text
fix dashboard loading thing
```

Improved:

```text
Debug the dashboard loading issue.

Instructions:
1. Inspect the dashboard data-loading flow.
2. Identify whether the issue is caused by loading state, API failure, auth, or an unexpected response shape.
3. Make the smallest safe fix.
4. Preserve the existing dashboard design and auth behaviour.
5. Add or update loading/error handling if it is missing.

Acceptance criteria:
- The dashboard loads the correct data.
- Loading and error states behave clearly.
- No unrelated dashboard sections are changed.
```

## Run locally

```bash
npm install
npm run build
```

Then open this folder in VS Code and press `F5` to launch an Extension Development Host.

## API key setup

Run this command inside VS Code:

```text
Prompt Saver: Set API Key
```

The API key is stored in VS Code SecretStorage, not in settings JSON.

## Settings

- `promptSaver.provider`: default `openai`
- `promptSaver.model`: default `gpt-4.1-mini`
- `promptSaver.temperature`: default `0.2`
- `promptSaver.maxOutputTokens`: default `700`
- `promptSaver.defaultOutputStyle`: default `structured`
- `promptSaver.autoCopyImprovedPrompt`: default `false`
- `promptSaver.showTokenEstimate`: default `true`
- `promptSaver.showPreviewAfterCompile`: default `false`

## Privacy

- No hosted backend.
- No prompt logging.
- No analytics.
- No prompt history.
- No raw prompts are stored.
- API keys stay in VS Code SecretStorage.
- Prompts are only sent to your selected AI provider.

## Integration note

Prompt Saver improves prompts and copies/replaces selected text. Direct insertion into another extension's chat panel depends on what that extension exposes through VS Code commands or APIs.

## Tech stack

- TypeScript
- VS Code Extension API
- SecretStorage
- Native QuickPick, InputBox, InformationMessage, clipboard, and preview documents
- OpenAI Chat Completions API
- esbuild

## Links

- Repository: https://github.com/hatimshahera/prompt-saver-for-codex
