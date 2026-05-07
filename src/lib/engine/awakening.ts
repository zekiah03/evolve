import type { Creature } from "../types";

// ====================================================================
// 感情の芽生え: 絶滅への段階的ルート
//
// 「生物は感情を持たないから生き残る」というテーゼの回収装置。
// 知能・記憶・内省・時間感覚の合計が各段階の閾値を超えると、
// 1エラにつき1段階ずつ進行。stage 9 に達した時に絶滅する。
//
// 第八章 (docs/theory.md) の含意に従い、以下の修飾因子を加える:
//
//   - groupBuffer: 群れに溶けることで自己が希薄化する → 抑制
//   - envModifyAccelerator: 環境改変は抽象目標の獲得を生む → 加速
//   - lateSymbolicPush: 段階5以降は創造性・文化が象徴体系を爆発させる → 加速
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

export type AwakeningBreakdown = {
  /** 認知の総量 (intelligence + memory + introspection + timeSense) */
  raw: number;
  /** 群れによる緩衝（社会性 + 群れ規模 + 分業 の平均） */
  groupBuffer: number;
  /** 環境改変による加速（envModify × 0.7） */
  envModifyAccelerator: number;
  /** 段階5以降の象徴文化加速（creativity + culture の平均） */
  lateSymbolicPush: number;
  /** 最終的な有効スコア = raw - buffer + accelerator + lateSymbolic */
  effective: number;
};

function rawScore(c: Creature): number {
  return (
    (c.params.introspection ?? 0) +
    (c.params.intelligence ?? 0) +
    (c.params.memory ?? 0) +
    (c.params.timeSense ?? 0)
  );
}

function groupBuffer(c: Creature): number {
  const social =
    (c.params.sociality ?? 0) +
    (c.params.groupSize ?? 0) +
    (c.params.division ?? 0);
  return Math.max(0, social / 3);
}

function envModifyAccelerator(c: Creature): number {
  return Math.max(0, (c.params.envModify ?? 0) * 0.7);
}

function lateSymbolicPush(c: Creature, currentStage: number): number {
  if (currentStage < 5) return 0;
  return Math.max(
    0,
    ((c.params.creativity ?? 0) + (c.params.culture ?? 0)) / 2,
  );
}

export function awakeningBreakdown(
  c: Creature,
  currentStage: number,
): AwakeningBreakdown {
  const raw = rawScore(c);
  const buffer = groupBuffer(c);
  const accel = envModifyAccelerator(c);
  const symbolic = lateSymbolicPush(c, currentStage);
  return {
    raw,
    groupBuffer: buffer,
    envModifyAccelerator: accel,
    lateSymbolicPush: symbolic,
    effective: raw - buffer + accel + symbolic,
  };
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
  const current = creature.emotionAwakening;
  const { effective } = awakeningBreakdown(creature, current);

  // 次段階 N へ進むには effective >= current + 2 が必要
  // (stage 0 → 1 は effective >= 2、stage 5 → 6 は effective >= 7)
  const thresholdToAdvance = current + 2;
  if (effective >= thresholdToAdvance && current < 9) {
    const next = (current + 1) as AwakeningStage;
    return {
      stage: next,
      advanced: true,
      event: AWAKENING_STAGES[next],
    };
  }
  return { stage: current, advanced: false };
}
