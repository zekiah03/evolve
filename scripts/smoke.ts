// Smoke test for emotion → creature mapping
// Run: npx tsx scripts/smoke.mts

import { emotionToCreature } from "../src/lib/engine/emotionToCreature";
import {
  computeEmotionProfile,
  computeEnvironmentProfile,
} from "../src/lib/engine/profile";
import { PARAMS } from "../src/lib/data/parameters";
import type {
  AnswerIndex,
  EmotionProfile,
  ParamId,
} from "../src/lib/types";

function pickNonZero(
  params: Record<ParamId, number>,
): Array<[string, number]> {
  return PARAMS.filter((p) => params[p.id] !== 0).map((p) => [
    `${p.group}/${p.label}`,
    params[p.id],
  ]);
}

function show(label: string, profile: EmotionProfile) {
  const creature = emotionToCreature(profile);
  console.log(`\n=== ${label} ===`);
  console.log("profile:", profile);
  console.log("categories:", creature.categories);
  const nonZero = pickNonZero(creature.params);
  console.log(`non-zero params (${nonZero.length}):`);
  for (const [k, v] of nonZero) console.log(`  ${k}: ${v > 0 ? "+" : ""}${v}`);
}

// Case 1: all-positive extremes → maximally expressive, reactive, empathic, offensive, driven, conforming
show("全軸 +2 (感情発散・集団駆動型)", {
  expression: 2,
  speed: 2,
  distance: 2,
  direction: 2,
  fuel: 2,
  conformity: 2,
});

// Case 2: all-negative extremes → contained, deliberate, independent, defensive, avoidant, unique
show("全軸 -2 (内包・熟慮・独立型)", {
  expression: -2,
  speed: -2,
  distance: -2,
  direction: -2,
  fuel: -2,
  conformity: -2,
});

// Case 3: neutral
show("全軸 0 (中立)", {
  expression: 0,
  speed: 0,
  distance: 0,
  direction: 0,
  fuel: 0,
  conformity: 0,
});

// Case 4: concrete answer set — pick A for all 6 questions
console.log("\n=== 診断: 全てAを選んだ場合 ===");
const allA: AnswerIndex[] = [0, 0, 0, 0, 0, 0];
const profile = computeEmotionProfile(allA);
console.log("profile:", profile);
const creature = emotionToCreature(profile);
console.log("categories:", creature.categories);
console.log(
  "non-zero params:",
  pickNonZero(creature.params)
    .map(([k, v]) => `${k}=${v}`)
    .join(", "),
);

// Case 5: environment profile smoke
console.log("\n=== 環境診断: 全てAを選んだ場合 ===");
const env = computeEnvironmentProfile(allA);
console.log("env profile:", env);
