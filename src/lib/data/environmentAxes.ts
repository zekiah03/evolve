import type { AxisMeta, EnvironmentAxisId } from "../types";

export const ENVIRONMENT_AXES: ReadonlyArray<AxisMeta<EnvironmentAxisId>> = [
  { id: "temperature", label: "温度", positive: "温暖", negative: "寒冷" },
  { id: "humidity", label: "湿度", positive: "湿潤", negative: "乾燥" },
  { id: "light", label: "光量", positive: "明", negative: "暗" },
  { id: "altitude", label: "高度", positive: "高", negative: "低" },
  { id: "space", label: "空間", positive: "開放", negative: "閉鎖" },
  { id: "volatility", label: "変動", positive: "激変", negative: "安定" },
] as const;

export const ENVIRONMENT_AXIS_MAP: Readonly<
  Record<EnvironmentAxisId, AxisMeta<EnvironmentAxisId>>
> = Object.fromEntries(ENVIRONMENT_AXES.map((a) => [a.id, a])) as Readonly<
  Record<EnvironmentAxisId, AxisMeta<EnvironmentAxisId>>
>;
