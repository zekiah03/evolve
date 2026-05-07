import { EMOTION_AXES } from "../data/emotionAxes";
import { ENVIRONMENT_AXES } from "../data/environmentAxes";
import { PARAM_MAP } from "../data/parameters";
import { awakeningBreakdown } from "../engine/awakening";
import type {
  AwakeningBreakdown,
} from "../engine/awakening";
import type {
  Creature,
  EmotionAxisId,
  EmotionProfile,
  Era,
  ParamId,
} from "../types";

// ====================================================================
// 結果画面の「進化の論理」セクションのためのデータを組み立てる。
//
// 表示する三層:
//   1. 核となった感情 (top N の感情軸)
//   2. 環境が要求したもの (各エラの主因変異)
//   3. 体に残った印 (top N の最終形質)
// 加えて、感情覚醒の内訳（buffer / accelerator）を可視化する。
// ====================================================================

export type EmotionHighlight = {
  axisId: EmotionAxisId;
  label: string;
  pole: string;
  magnitude: number;
};

export function topEmotionAxes(
  profile: EmotionProfile,
  n = 3,
): EmotionHighlight[] {
  return EMOTION_AXES
    .map((a) => ({
      axisId: a.id,
      label: a.label,
      pole: profile[a.id] >= 0 ? a.positive : a.negative,
      magnitude: Math.abs(profile[a.id]),
    }))
    .filter((x) => x.magnitude > 0)
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, n);
}

export type TraitHighlight = {
  paramId: ParamId;
  label: string;
  value: number;
  group: string;
};

export function topTraits(creature: Creature, n = 6): TraitHighlight[] {
  return (Object.entries(creature.params) as Array<[ParamId, number]>)
    .filter(([, v]) => Math.abs(v) >= 1)
    .map(([id, v]) => ({
      paramId: id,
      label: PARAM_MAP[id]?.label ?? id,
      value: v,
      group: PARAM_MAP[id]?.group ?? "",
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, n);
}

export type EraDriver = {
  eraIndex: number;
  biome: string;
  /** そのエラで起きた最も重要な変異（最初に挙がる現象名） */
  primaryEffect: string | null;
  /** その変異を引き起こしたエラのアクティブ軸（例: "温暖×湿潤"） */
  drivingAxes: string;
  /** マイルストーンが発火した場合 */
  milestones: readonly string[];
  extinct: boolean;
};

export function eraDrivers(eras: Era[], creature: Creature): EraDriver[] {
  return creature.eraHistory.map((result) => {
    const era = eras[result.eraIndex];

    const primaryEffect =
      result.mutations[0]?.phenomenon ??
      (result.triggeredMilestones[0] ?? null);

    // そのエラの2つの活性軸を「温暖×湿潤」のような短縮形にまとめる
    const drivingAxes = Object.entries(era.axes)
      .map(([id, val]) => {
        const meta = ENVIRONMENT_AXES.find((a) => a.id === id);
        if (!meta || val == null) return null;
        return val > 0 ? meta.positive : meta.negative;
      })
      .filter((s): s is string => Boolean(s))
      .join("×");

    return {
      eraIndex: result.eraIndex,
      biome: era.biomeLabel,
      primaryEffect,
      drivingAxes,
      milestones: result.triggeredMilestones,
      extinct: result.extinct,
    };
  });
}

export type AwakeningExplanation = {
  breakdown: AwakeningBreakdown;
  finalStage: number;
  /** 加速・抑制要因のうち、最も影響の大きかったもの */
  dominantInfluence:
    | "raw"
    | "groupBuffer"
    | "envModifyAccelerator"
    | "lateSymbolicPush"
    | "none";
};

export function explainAwakening(creature: Creature): AwakeningExplanation {
  const breakdown = awakeningBreakdown(creature, creature.emotionAwakening);
  const candidates: Array<{
    name: AwakeningExplanation["dominantInfluence"];
    value: number;
  }> = [
    { name: "groupBuffer", value: breakdown.groupBuffer },
    { name: "envModifyAccelerator", value: breakdown.envModifyAccelerator },
    { name: "lateSymbolicPush", value: breakdown.lateSymbolicPush },
  ];
  const dominant = candidates.sort((a, b) => b.value - a.value)[0];
  return {
    breakdown,
    finalStage: creature.emotionAwakening,
    dominantInfluence:
      dominant.value > 0.5 ? dominant.name : breakdown.raw > 1 ? "raw" : "none",
  };
}

export const AWAKENING_INFLUENCE_LABEL: Readonly<
  Record<AwakeningExplanation["dominantInfluence"], string>
> = {
  raw: "知性そのものが、自己を生んだ",
  groupBuffer: "群れに溶けて、自己が薄れた",
  envModifyAccelerator: "環境を変える力が、抽象を芽吹かせた",
  lateSymbolicPush: "創造と文化が、象徴を爆発させた",
  none: "意識の種は、まだ眠っている",
};
