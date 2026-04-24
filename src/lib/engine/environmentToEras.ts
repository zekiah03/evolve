import { ENVIRONMENT_QUESTIONS } from "../data/environmentQuestions";
import type {
  AnswerIndex,
  AxisValue,
  CategoryRequirement,
  EnvironmentAxisId,
  Era,
  ParamRequirement,
} from "../types";

// ====================================================================
// 環境診断 → 6エラ
//
// 各問 = 1エラ。そのエラで「アクティブな2軸」は、その問に紐づく
// 2つの環境軸（ユーザーの回答で ±1 に振れる）。
// 各軸の極性から、パラメータ要求値とカテゴリ要求値を合算する。
// ====================================================================

type PolarRequirement = {
  params: ReadonlyArray<{ param: ParamRequirement["param"]; target: number; weight?: number }>;
  categories?: ReadonlyArray<{ category: CategoryRequirement["category"]; preferred: readonly string[]; weight?: number }>;
};

const AXIS_REQS: Record<
  EnvironmentAxisId,
  { positive: PolarRequirement; negative: PolarRequirement }
> = {
  // 温度: 温暖(+) / 寒冷(-)
  temperature: {
    positive: {
      params: [
        { param: "metabolism", target: 1 },
        { param: "size", target: -1 },
        { param: "lifespan", target: -1 },
        { param: "reproStrategy", target: 1 },
        { param: "highTemp", target: 1 },
      ],
      categories: [
        { category: "bodyCovering", preferred: ["鱗", "裸肌"] },
        { category: "bodyTempType", preferred: ["冷血", "中間"] },
      ],
    },
    negative: {
      params: [
        { param: "size", target: 1 },
        { param: "metabolism", target: -1 },
        { param: "lifespan", target: 1 },
        { param: "reproStrategy", target: -1 },
        { param: "lowTemp", target: 1 },
      ],
      categories: [
        { category: "bodyCovering", preferred: ["毛皮", "羽毛"] },
        { category: "bodyTempType", preferred: ["恒温"] },
      ],
    },
  },
  // 湿度: 湿潤(+) / 乾燥(-)
  humidity: {
    positive: {
      params: [
        { param: "touch", target: 1 },
        { param: "smell", target: -1 },
        { param: "swimming", target: 1 },
      ],
      categories: [
        { category: "bodyCovering", preferred: ["粘膜", "裸肌"] },
      ],
    },
    negative: {
      params: [
        { param: "smell", target: 1 },
        { param: "size", target: -1 },
        { param: "drought", target: 1 },
        { param: "vision", target: -1 },
        { param: "touch", target: 1 },
      ],
      categories: [
        { category: "bodyCovering", preferred: ["殻", "鱗"] },
      ],
    },
  },
  // 光量: 明(+) / 暗(-)
  light: {
    positive: {
      params: [
        { param: "vision", target: 2 },
        { param: "sociality", target: 1 },
      ],
    },
    negative: {
      params: [
        { param: "vision", target: -2 },
        { param: "hearing", target: 1 },
        { param: "smell", target: 1 },
        { param: "touch", target: 1 },
        { param: "sixthSense", target: 1 },
        { param: "echolocation", target: 1 },
      ],
    },
  },
  // 高度: 高(+) / 低(-)
  altitude: {
    positive: {
      params: [
        { param: "size", target: -1 },
        { param: "moveSpeed", target: 1 },
        { param: "flight", target: 1 },
        { param: "climbing", target: 1 },
        { param: "intelligence", target: 1 },
        { param: "lowOxygen", target: 1 },
      ],
      categories: [
        { category: "movementLayer", preferred: ["樹上", "空中"] },
      ],
    },
    negative: {
      params: [
        { param: "size", target: 1 },
        { param: "vision", target: -1 },
        { param: "touch", target: 1 },
        { param: "digging", target: 1 },
        { param: "swimming", target: 1 },
        { param: "pressureRes", target: 1 },
      ],
      categories: [
        { category: "movementLayer", preferred: ["地中", "水中"] },
      ],
    },
  },
  // 空間: 開放(+) / 閉鎖(-)
  space: {
    positive: {
      params: [
        { param: "moveSpeed", target: 2 },
        { param: "sociality", target: 1 },
        { param: "vision", target: 1 },
        { param: "endurance", target: 1 },
      ],
    },
    negative: {
      params: [
        { param: "size", target: -1 },
        { param: "sociality", target: -1 },
        { param: "touch", target: 1 },
        { param: "moveSpeed", target: -1 },
      ],
    },
  },
  // 変動: 激変(+) / 安定(-)
  volatility: {
    positive: {
      params: [
        { param: "reproStrategy", target: 2 },
        { param: "lifespan", target: -1 },
        { param: "generationCycle", target: 1 },
        { param: "dormancy", target: 1 },
      ],
      categories: [
        { category: "diet", preferred: ["雑", "腐"] },
      ],
    },
    negative: {
      params: [
        { param: "lifespan", target: 1 },
        { param: "reproStrategy", target: -1 },
        { param: "intelligence", target: 1 },
        { param: "memory", target: 1 },
      ],
    },
  },
};

// ==================== バイオーム名（4択 × 6エラ） ====================

const BIOME_LABELS: Record<string, readonly [string, string, string, string]> = {
  E1: ["熱帯の砂浜", "地中海の石壁", "針葉樹の雪原", "乾いた高原"],
  E2: ["陽光の高み", "明るい地表", "星明かりの頂", "暗い穴倉"],
  E3: ["穏やかな平原", "荒野の激しさ", "時の止まった路地", "騒がしい下町"],
  E4: ["白昼の熱帯", "湿った熱帯夜", "雪晴れの朝", "極夜の静寂"],
  E5: ["霧の湿原", "苔むす深い森", "赤い砂漠", "岩山の迷路"],
  E6: ["雲上の高原", "嵐の山頂", "深海の底", "火山の地下"],
};

const ERA_TITLES: readonly [string, string, string, string, string, string] = [
  "誕生の地",
  "立体ニッチ",
  "日常の質感",
  "第一の転機",
  "領域の拡張",
  "終局",
];

// ==================== 主要関数 ====================

function clampTarget(v: number): number {
  if (v <= -2) return -2;
  if (v >= 2) return 2;
  return v;
}

function getActiveAxes(
  questionIndex: number,
  answerIndex: AnswerIndex,
): Partial<Record<EnvironmentAxisId, AxisValue>> {
  if (answerIndex == null) return {};
  const q = ENVIRONMENT_QUESTIONS[questionIndex];
  const choice = q.choices[answerIndex];
  const axes: Partial<Record<EnvironmentAxisId, AxisValue>> = {};
  for (const eff of choice.effects) {
    axes[eff.axis] = eff.delta as AxisValue;
  }
  return axes;
}

export function environmentToEras(
  answers: readonly AnswerIndex[],
): Era[] {
  return ENVIRONMENT_QUESTIONS.map((q, i) => {
    const answerIndex = answers[i];
    const axes = getActiveAxes(i, answerIndex);

    const paramsMap = new Map<string, ParamRequirement>();
    const categoryReqs: CategoryRequirement[] = [];

    for (const [axisIdStr, axisValue] of Object.entries(axes)) {
      const axisId = axisIdStr as EnvironmentAxisId;
      if (axisValue == null || axisValue === 0) continue;
      const polar = axisValue > 0 ? "positive" : "negative";
      const reqs = AXIS_REQS[axisId][polar];

      for (const p of reqs.params) {
        const existing = paramsMap.get(p.param);
        if (existing) {
          existing.target = clampTarget(existing.target + p.target);
          existing.weight = Math.max(existing.weight, p.weight ?? 1);
        } else {
          paramsMap.set(p.param, {
            param: p.param,
            target: clampTarget(p.target),
            weight: p.weight ?? 1,
          });
        }
      }

      if (reqs.categories) {
        for (const c of reqs.categories) {
          categoryReqs.push({
            category: c.category,
            preferred: [...c.preferred],
            weight: c.weight ?? 1,
          });
        }
      }
    }

    const biomeLabel =
      answerIndex != null
        ? (BIOME_LABELS[q.id]?.[answerIndex] ?? q.category ?? "")
        : "";
    const narrative =
      answerIndex != null ? q.choices[answerIndex].text : "";

    return {
      index: i as 0 | 1 | 2 | 3 | 4 | 5,
      title: ERA_TITLES[i],
      biomeLabel,
      narrative,
      axes,
      requirements: Array.from(paramsMap.values()),
      categoryRequirements: categoryReqs,
    };
  });
}
