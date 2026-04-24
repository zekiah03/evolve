import type { Creature } from "../types";

// ====================================================================
// 感情の芽生え: 絶滅への段階的ルート
//
// 「生物は感情を持たないから生き残る」というテーゼの回収装置。
// 知能・記憶・内省・時間感覚の合計が各段階の閾値を超えると、
// 1エラにつき1段階ずつ進行。stage 9 に達した時に絶滅する。
// ====================================================================

export const AWAKENING_STAGES = [
  "静けさ", // 0
  "内省の発生", // 1
  "時間の発見", // 2
  "恐怖の学習", // 3
  "悲しみの発見", // 4
  "愛の狂気", // 5
  "怒りの伝染", // 6
  "嫉妬の病", // 7
  "宗教の発生", // 8
  "悟り", // 9 — final, triggers extinction
] as const;

export type AwakeningStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

function awakeningScore(creature: Creature): number {
  return (
    (creature.params.introspection ?? 0) +
    (creature.params.intelligence ?? 0) +
    (creature.params.memory ?? 0) +
    (creature.params.timeSense ?? 0)
  );
}

/**
 * 現在の生物と段階から、次段階への進行可否を判定する。
 * 段階は 1エラにつき最大1しか進まない。
 */
export function advanceAwakening(creature: Creature): {
  stage: AwakeningStage;
  advanced: boolean;
  event?: string;
} {
  const score = awakeningScore(creature);
  const current = creature.emotionAwakening;

  // 次段階 N へ進むには score >= N + 1 が必要
  // (stage 0 → 1 は score >= 2、stage 5 → 6 は score >= 7)
  const thresholdToAdvance = current + 2;
  if (score >= thresholdToAdvance && current < 9) {
    const next = (current + 1) as AwakeningStage;
    return {
      stage: next,
      advanced: true,
      event: AWAKENING_STAGES[next],
    };
  }
  return { stage: current, advanced: false };
}
