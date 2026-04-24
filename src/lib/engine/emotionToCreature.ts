import {
  DEFAULT_CATEGORIES,
  DEFAULT_PARAMS,
} from "../data/parameters";
import type {
  CategoryId,
  CategoryValues,
  Creature,
  EmotionAxisId,
  EmotionProfile,
  ParamId,
} from "../types";

// ====================================================================
// 感情プロファイル → 初期生物パラメータ のマッピング
//
// 各感情軸の値（-2..+2）に重みを掛けてパラメータに加算する。
// 軸の値が ±2 に達した時のみ、カテゴリ型パラメータを上書きする。
// 最終的に各数値は整数に丸められ、[-2, +2] にクランプされる。
// ====================================================================

type ParamEffect = {
  param: ParamId;
  /** 軸値に掛ける重み。負の値は「軸が正に振れると逆方向へ」の意味 */
  weight: number;
};

type CategoryRule = {
  category: CategoryId;
  /** 軸値がこの絶対値以上の時に上書きが発火（通常は 2） */
  threshold: number;
  /** 軸値が +threshold 以上の時に設定する値 */
  high: string;
  /** 軸値が -threshold 以下の時に設定する値 */
  low: string;
};

type EmotionMapping = {
  paramEffects: ParamEffect[];
  categoryRules?: CategoryRule[];
};

const MAPPINGS: Record<EmotionAxisId, EmotionMapping> = {
  // 表出: 発散(+) / 内包(-)
  expression: {
    paramEffects: [
      { param: "voiceDepth", weight: 1 },
      { param: "colorRichness", weight: 1 },
      { param: "scentIdentity", weight: 0.7 },
      { param: "presence", weight: 1 },
      { param: "intimidation", weight: 0.5 },
      { param: "courtship", weight: 0.5 },
      { param: "mimicry", weight: -0.5 },
      { param: "stillness", weight: -1 },
    ],
    categoryRules: [
      { category: "coloration", threshold: 2, high: "派手", low: "透明" },
    ],
  },
  // 速度: 即応(+) / 熟慮(-)
  speed: {
    paramEffects: [
      { param: "burst", weight: 1 },
      { param: "moveSpeed", weight: 1 },
      { param: "metabolism", weight: 0.5 },
      { param: "hearing", weight: 0.5 },
      { param: "touch", weight: 0.5 },
      { param: "wariness", weight: 0.5 },
      { param: "intelligence", weight: -1 },
      { param: "memory", weight: -1 },
      { param: "learning", weight: -0.5 },
      { param: "endurance", weight: -0.5 },
    ],
  },
  // 距離: 共感(+) / 独立(-)
  distance: {
    paramEffects: [
      { param: "sociality", weight: 1 },
      { param: "groupSize", weight: 1 },
      { param: "communication", weight: 1 },
      { param: "nurturing", weight: 1 },
      { param: "symbiosis", weight: 0.5 },
      { param: "division", weight: 0.5 },
      { param: "hierarchy", weight: 0.5 },
      { param: "territoriality", weight: -0.7 },
      { param: "loneliness", weight: -1 },
    ],
  },
  // 方向: 攻撃(+) / 防御(-)
  direction: {
    paramEffects: [
      { param: "aggression", weight: 1 },
      { param: "toxicity", weight: 0.5 },
      { param: "foodChainPosition", weight: 1 },
      { param: "intimidation", weight: 0.5 },
      { param: "wariness", weight: -0.5 },
      { param: "mimicry", weight: -0.5 },
      { param: "stillness", weight: -0.5 },
    ],
    categoryRules: [
      { category: "defenseType", threshold: 2, high: "毒", low: "装甲" },
      { category: "attackType", threshold: 2, high: "毒", low: "噛" },
    ],
  },
  // 燃料化: 駆動(+) / 回避(-)
  fuel: {
    paramEffects: [
      { param: "metabolism", weight: 1 },
      { param: "endurance", weight: 1 },
      { param: "curiosity", weight: 1 },
      { param: "play", weight: 0.5 },
      { param: "burst", weight: 0.5 },
      { param: "lifespan", weight: -0.5 },
      { param: "dormancy", weight: -1 },
      { param: "periodicSleep", weight: -0.5 },
      { param: "timeStop", weight: -0.5 },
    ],
    categoryRules: [
      { category: "bodyTempType", threshold: 2, high: "恒温", low: "冷血" },
    ],
  },
  // 同調: 同化(+) / 独自(-)
  conformity: {
    paramEffects: [
      { param: "hierarchy", weight: 1 },
      { param: "division", weight: 1 },
      { param: "sociality", weight: 0.3 },
      { param: "mimicry", weight: 0.5 },
      { param: "creativity", weight: -1 },
      { param: "holiness", weight: -0.5 },
      { param: "parallelism", weight: -0.5 },
      { param: "generationCycle", weight: -0.3 },
      { param: "loneliness", weight: -0.3 },
    ],
  },
};

function clampParam(v: number): number {
  if (v <= -2) return -2;
  if (v >= 2) return 2;
  return v;
}

export function emotionToCreature(profile: EmotionProfile): Creature {
  const params: Record<ParamId, number> = { ...DEFAULT_PARAMS };
  const categories = { ...DEFAULT_CATEGORIES };

  for (const axisId of Object.keys(MAPPINGS) as EmotionAxisId[]) {
    const axisValue = profile[axisId];
    const mapping = MAPPINGS[axisId];

    for (const eff of mapping.paramEffects) {
      params[eff.param] += axisValue * eff.weight;
    }

    if (!mapping.categoryRules) continue;
    for (const rule of mapping.categoryRules) {
      if (axisValue >= rule.threshold) {
        setCategory(categories, rule.category, rule.high);
      } else if (axisValue <= -rule.threshold) {
        setCategory(categories, rule.category, rule.low);
      }
    }
  }

  for (const key of Object.keys(params) as ParamId[]) {
    params[key] = clampParam(Math.round(params[key]));
  }

  return {
    params,
    categories,
    phenomena: [],
    milestones: [],
    relations: { predators: [], symbionts: [] },
    emotionAwakening: 0,
    alive: true,
    eraHistory: [],
  };
}

function setCategory(
  target: { [K in CategoryId]: CategoryValues[K] },
  key: CategoryId,
  value: string,
): void {
  // CategoryValues[key] is a union of literals; we've constrained values
  // at the mapping definition, so this assertion is safe.
  (target[key] as string) = value;
}
