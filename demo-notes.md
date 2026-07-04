# Demo Notes: Prompt Saver for Codex

## Demo goal

Show that a rough coding-agent prompt can become a clearer, safer, paste-ready instruction in one shortcut.

## Demo flow

1. Open a code file in VS Code.
2. Type a rough prompt in a scratch file:

   ```text
   fix auth refresh bug
   ```

3. Select the text.
4. Press `Cmd+Alt+P`.
5. Show the improved prompt action message.
6. Choose `Open Preview` to show original prompt, improved prompt, and token estimate.
7. Run the flow again and choose `Copy Improved Prompt`.
8. Paste the result into Codex.

## Edge cases to show

- No selection opens the input box.
- Clipboard prompt can be improved without touching the editor.
- Selected code asks what the coding agent should do with the selected code.
- Token estimate may increase when a vague prompt needs structure.

## Screenshot/video ideas

- Before/after prompt in a markdown preview.
- Command palette showing Prompt Saver commands.
- SecretStorage key setup command.
- Status bar item labeled `Prompt Saver`.

## Reel hook

`Stop sending "fix this" to coding agents. I built a VS Code extension that rewrites rough prompts into clearer Codex instructions before you send them.`
