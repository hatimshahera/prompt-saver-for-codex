import type { TokenTradeoffLabel } from "../types";

export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.trim().length / 4));
}

export function getTokenTradeoffLabel(before: number, after: number): TokenTradeoffLabel {
  if (after < before * 0.9) {
    return "shorter";
  }

  if (after > before * 1.1) {
    return "longer-but-clearer";
  }

  return "same-length-better";
}

export function formatTokenTradeoff(label: TokenTradeoffLabel): string {
  switch (label) {
    case "shorter":
      return "Shorter and cleaner";
    case "longer-but-clearer":
      return "Longer, but clearer";
    case "same-length-better":
      return "Similar length, better structured";
  }
}
