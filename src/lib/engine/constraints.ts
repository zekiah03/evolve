import type { Creature } from "../types";

// ====================================================================
// 形質間の進化的制約
//
// 第八章 8.3 / 9.1.B (docs/theory.md) に基づく実装。
//
// 突然変異は個別の選択圧に応じて起きるが、生物には物理的・代謝的に
// 同居できない組み合わせが存在する。例えば:
//
//   - 外骨格 / 殻は脱皮の制約上、巨大な脳を支えにくい
//     (節足動物が脊椎動物のような知能を獲得しなかった理由の一つ)。
//   - 光合成生物は静止していなければ光に当たり続けられない。
//   - 巨大な生物は square-cube law により高代謝を維持できない。
//
// このモジュールは突然変異適用後に呼ばれ、抵触する組み合わせを
// クランプし、その事実を現象名として記録する。
// ====================================================================

export type ConstraintEvent = {
  /** 抵触した制約の名前（現象名として表示） */
  phenomenon: string;
  /** 制約により下げられたパラメータ */
  paramId: keyof Creature["params"];
  /** 制約適用後の値 */
  clampedTo: number;
};

export function enforceConstraints(c: Creature): ConstraintEvent[] {
  const events: ConstraintEvent[] = [];

  // 外骨格・甲殻は脳容積を制限する
  const hasShell =
    c.categories.skeleton === "外骨格" || c.categories.bodyCovering === "殻";
  const INTELLIGENCE_CAP_FOR_SHELL = 1;
  if (hasShell && c.params.intelligence > INTELLIGENCE_CAP_FOR_SHELL) {
    c.params.intelligence = INTELLIGENCE_CAP_FOR_SHELL;
    events.push({
      phenomenon: "外骨格の知能制約",
      paramId: "intelligence",
      clampedTo: INTELLIGENCE_CAP_FOR_SHELL,
    });
  }

  // 光合成は移動を制限する（静止する方が光に当たり続けられる）
  const PHOTOSYNTHESIS_THRESHOLD = 1;
  const MOVE_SPEED_CAP_FOR_PHOTOSYNTHESIS = 0;
  if (
    (c.params.photosynthesis ?? 0) >= PHOTOSYNTHESIS_THRESHOLD &&
    c.params.moveSpeed > MOVE_SPEED_CAP_FOR_PHOTOSYNTHESIS
  ) {
    c.params.moveSpeed = MOVE_SPEED_CAP_FOR_PHOTOSYNTHESIS;
    events.push({
      phenomenon: "光合成の沈黙",
      paramId: "moveSpeed",
      clampedTo: MOVE_SPEED_CAP_FOR_PHOTOSYNTHESIS,
    });
  }

  // 巨大化は代謝を制限する（square-cube law: 表面積 vs 体積）
  const LARGE_SIZE_THRESHOLD = 2;
  const METABOLISM_CAP_FOR_LARGE = 1;
  if (
    c.params.size >= LARGE_SIZE_THRESHOLD &&
    c.params.metabolism > METABOLISM_CAP_FOR_LARGE
  ) {
    c.params.metabolism = METABOLISM_CAP_FOR_LARGE;
    events.push({
      phenomenon: "巨大化の代謝制約",
      paramId: "metabolism",
      clampedTo: METABOLISM_CAP_FOR_LARGE,
    });
  }

  return events;
}
