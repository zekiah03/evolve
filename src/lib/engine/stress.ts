import { PARAM_MAP } from "../data/parameters";
import type { Creature, Era } from "../types";

// カテゴリ要求を満たさなかった時のペナルティ
const CATEGORY_MISMATCH_PENALTY = 3;
// 環境改変力1あたり、ストレスを何割軽減するか
const ENV_MODIFY_MITIGATION_PER_POINT = 0.1;
// 軽減の上限（100%軽減は許さない）
const ENV_MODIFY_MITIGATION_CAP = 0.5;

export type StressContribution = {
  label: string;
  value: number;
};

export type StressBreakdown = {
  /** 最終ストレス（軽減後） */
  total: number;
  /** 軽減前の生ストレス */
  raw: number;
  /** パラメータ要求の未達分 */
  paramStress: number;
  /** カテゴリ要求の未達分 */
  categoryStress: number;
  /** 環境改変による軽減率（0〜0.5） */
  mitigation: number;
  /** 寄与の大きい順に並べた内訳（最大5件） */
  worst: StressContribution[];
};

export function computeStress(creature: Creature, era: Era): StressBreakdown {
  const contributions: StressContribution[] = [];

  let paramStress = 0;
  for (const req of era.requirements) {
    const current = creature.params[req.param] ?? 0;
    const diff = Math.abs(current - req.target) * req.weight;
    if (diff > 0) {
      paramStress += diff;
      contributions.push({
        label: `${PARAM_MAP[req.param].label}(現${current}/要${req.target})`,
        value: diff,
      });
    }
  }

  let categoryStress = 0;
  for (const creq of era.categoryRequirements) {
    const current = creature.categories[creq.category] as string;
    if (!creq.preferred.includes(current)) {
      const v = CATEGORY_MISMATCH_PENALTY * creq.weight;
      categoryStress += v;
      contributions.push({
        label: `${creq.category}(現${current}/要${creq.preferred.join("or")})`,
        value: v,
      });
    }
  }

  const raw = paramStress + categoryStress;
  const envModify = creature.params.envModify ?? 0;
  const mitigation = Math.min(
    ENV_MODIFY_MITIGATION_CAP,
    Math.max(0, envModify * ENV_MODIFY_MITIGATION_PER_POINT),
  );
  const total = raw * (1 - mitigation);

  contributions.sort((a, b) => b.value - a.value);

  return {
    total,
    raw,
    paramStress,
    categoryStress,
    mitigation,
    worst: contributions.slice(0, 5),
  };
}
