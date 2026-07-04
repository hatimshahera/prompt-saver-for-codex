import type { PromptMode } from "../types";

const codeSignals = [
  "function ",
  "const ",
  "let ",
  "var ",
  "class ",
  "import ",
  "export ",
  "=>",
  "</",
  "{",
  "}",
  "def ",
  "public ",
  "private "
];

export function inferMode(prompt: string): Exclude<PromptMode, "auto"> {
  const text = prompt.toLowerCase();

  if (/\b(test|tests|spec|coverage|jest|vitest|playwright)\b/.test(text)) {
    return "test";
  }

  if (/\b(review|audit|check|feedback)\b/.test(text)) {
    return "review";
  }

  if (/\b(shorter|compress|condense|summari[sz]e|reduce)\b/.test(text)) {
    return "compress";
  }

  if (/\b(refactor|clean|simplify|organize|tidy)\b/.test(text)) {
    return "refactor";
  }

  if (/\b(fix|bug|error|failing|broken|debug|issue|crash)\b/.test(text)) {
    return "debug";
  }

  return "build";
}

export function looksLikeCode(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.split(/\r?\n/).length >= 4 && /[{}();]/.test(trimmed)) {
    return true;
  }

  return codeSignals.some((signal) => trimmed.includes(signal));
}
