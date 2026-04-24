import type { AnswerIndex } from "./types";

// URLパラメータで結果を共有する。
// 12問の回答（各 0〜3）を 12 文字の A/B/C/D 文字列として URL に載せる。
//
// 例: ?r=ABCDABCDABCD
//      └─── 感情6問 ─┘└─ 環境6問 ─┘

export const SHARE_PARAM = "r";
export const SHARE_CODE_LENGTH = 12;

const IDX_TO_CHAR = ["A", "B", "C", "D"] as const;
const CHAR_TO_IDX: Readonly<Record<string, 0 | 1 | 2 | 3>> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

export function encodeAnswers(
  emotion: readonly AnswerIndex[],
  environment: readonly AnswerIndex[],
): string | null {
  if (emotion.length !== 6 || environment.length !== 6) return null;
  const all = [...emotion, ...environment];
  if (all.some((a) => a == null)) return null;
  return all.map((a) => IDX_TO_CHAR[a as 0 | 1 | 2 | 3]).join("");
}

export function decodeAnswers(code: string): {
  emotion: (0 | 1 | 2 | 3)[];
  environment: (0 | 1 | 2 | 3)[];
} | null {
  if (!isValidCode(code)) return null;
  const indices = Array.from(code).map((c) => CHAR_TO_IDX[c]);
  return {
    emotion: indices.slice(0, 6),
    environment: indices.slice(6, 12),
  };
}

export function isValidCode(code: unknown): code is string {
  return (
    typeof code === "string" &&
    code.length === SHARE_CODE_LENGTH &&
    /^[ABCD]+$/.test(code)
  );
}

export function buildShareUrl(code: string, baseUrl?: string): string {
  const base = baseUrl ?? (typeof window !== "undefined" ? window.location.origin + window.location.pathname : "");
  if (!base) return "";
  const url = new URL(base);
  url.search = `?${SHARE_PARAM}=${code}`;
  url.hash = "";
  return url.toString();
}
