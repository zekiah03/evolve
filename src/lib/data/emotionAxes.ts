import type { AxisMeta, EmotionAxisId } from "../types";

export const EMOTION_AXES: ReadonlyArray<AxisMeta<EmotionAxisId>> = [
  { id: "expression", label: "表出", positive: "発散", negative: "内包" },
  { id: "speed", label: "速度", positive: "即応", negative: "熟慮" },
  { id: "distance", label: "距離", positive: "共感", negative: "独立" },
  { id: "direction", label: "方向", positive: "攻撃", negative: "防御" },
  { id: "fuel", label: "燃料化", positive: "駆動", negative: "回避" },
  { id: "conformity", label: "同調", positive: "同化", negative: "独自" },
] as const;

export const EMOTION_AXIS_MAP: Readonly<
  Record<EmotionAxisId, AxisMeta<EmotionAxisId>>
> = Object.fromEntries(EMOTION_AXES.map((a) => [a.id, a])) as Readonly<
  Record<EmotionAxisId, AxisMeta<EmotionAxisId>>
>;
