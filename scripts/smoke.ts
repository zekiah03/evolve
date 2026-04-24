// Smoke test for engine
// Run: npx tsx scripts/smoke.ts

import { emotionToCreature } from "../src/lib/engine/emotionToCreature";
import { environmentToEras } from "../src/lib/engine/environmentToEras";
import {
  computeEmotionProfile,
  computeEnvironmentProfile,
} from "../src/lib/engine/profile";
import { simulateAll } from "../src/lib/engine/simulator";
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

function showEras(label: string, answers: AnswerIndex[]) {
  console.log(`\n=== エラ列: ${label} ===`);
  const eras = environmentToEras(answers);
  for (const era of eras) {
    console.log(
      `\n[E${era.index + 1}] ${era.title}「${era.biomeLabel}」`,
    );
    console.log(`  axes:`, era.axes);
    console.log(
      `  要求パラメータ (${era.requirements.length}):`,
      era.requirements
        .map(
          (r) => `${r.param}=${r.target > 0 ? "+" : ""}${r.target}`,
        )
        .join(", "),
    );
    if (era.categoryRequirements.length > 0) {
      console.log(
        `  要求カテゴリ:`,
        era.categoryRequirements
          .map((c) => `${c.category}∈{${c.preferred.join("/")}}`)
          .join(", "),
      );
    }
  }
}

showEras("全てA", allA);
showEras("全てD（逆側）", [3, 3, 3, 3, 3, 3]);

// ---- 7: 完全なシミュレーション (感情全A × 環境全A) ----
function runSimulation(
  label: string,
  emotionAnswers: AnswerIndex[],
  envAnswers: AnswerIndex[],
) {
  console.log(`\n\n============ シミュレーション: ${label} ============`);
  const eProfile = computeEmotionProfile(emotionAnswers);
  const envP = computeEnvironmentProfile(envAnswers);
  console.log("感情:", eProfile);
  console.log("環境:", envP);
  const initial = emotionToCreature(eProfile);
  const eras = environmentToEras(envAnswers);
  const final = simulateAll(initial, eras);

  for (const result of final.eraHistory) {
    const era = eras[result.eraIndex];
    console.log(
      `\n[E${result.eraIndex + 1}] ${era.title}「${era.biomeLabel}」  stress=${result.stress}  awakening=${result.emotionStage}${result.extinct ? " 💀" : ""}`,
    );
    if (result.mutations.length > 0) {
      console.log(
        `  変異: ${result.mutations.map((m) => m.phenomenon).join(" / ")}`,
      );
    }
    if (result.triggeredMilestones.length > 0) {
      console.log(
        `  ★マイルストーン: ${result.triggeredMilestones.join(" / ")}`,
      );
    }
    console.log(`  ${result.narrative}`);
  }

  console.log(`\n--- 最終状態 ---`);
  console.log(`生存: ${final.alive ? "◯" : "✕"}`);
  console.log(`感情段階: ${final.emotionAwakening}`);
  console.log(`達成マイルストーン(${final.milestones.length}): ${final.milestones.join(", ")}`);
  console.log(`現象名履歴: ${final.phenomena.join(" → ")}`);
  console.log(`最終カテゴリ:`, final.categories);
  const nonZero = PARAMS.filter((p) => final.params[p.id] !== 0)
    .map((p) => `${p.label}=${final.params[p.id]}`)
    .join(", ");
  console.log(`最終パラメータ: ${nonZero}`);
}

runSimulation("感情全A × 環境全A", allA, allA);
runSimulation(
  "感情全D × 環境全D（孤高・地下）",
  [3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3],
);
runSimulation(
  "感情: 知能特化 (C優勢) × 環境: 安定地 (A)",
  [2, 2, 2, 2, 2, 2],
  allA,
);
