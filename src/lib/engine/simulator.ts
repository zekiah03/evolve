import type { Creature, Era, EraResult, Mutation } from "../types";
import { advanceAwakening } from "./awakening";
import {
  applyMutation,
  selectCategoryMutations,
  selectParamMutations,
} from "./mutate";
import { computeStress, type StressBreakdown } from "./stress";

// ストレス閾値
export const SAFE_THRESHOLD = 4;
export const MUTATE_THRESHOLD = 12;
export const HEAVY_MUTATE_THRESHOLD = 22;
export const EXTINCT_THRESHOLD = 35;

/**
 * 1エラを処理する（生物を破壊的に更新）。戻り値は EraResult。
 */
export function simulateEra(creature: Creature, era: Era): EraResult {
  const stress = computeStress(creature, era);
  const mutations: Mutation[] = [];
  let extinct = false;

  if (stress.total < SAFE_THRESHOLD) {
    // 安定: 変異なし
  } else if (stress.total < MUTATE_THRESHOLD) {
    mutations.push(...selectParamMutations(creature, era, 1));
  } else if (stress.total < HEAVY_MUTATE_THRESHOLD) {
    mutations.push(...selectParamMutations(creature, era, 2));
    mutations.push(...selectCategoryMutations(creature, era, 1));
  } else if (stress.total < EXTINCT_THRESHOLD) {
    // 強制大変異
    mutations.push(...selectParamMutations(creature, era, 4));
    mutations.push(...selectCategoryMutations(creature, era));
  } else {
    extinct = true;
  }

  for (const m of mutations) applyMutation(creature, m);

  // 感情の芽生え判定（変異後、知能等が上がっているかもしれない）
  const awakening = advanceAwakening(creature);
  if (awakening.advanced && awakening.event) {
    creature.phenomena.push(awakening.event);
    creature.emotionAwakening = awakening.stage;
    if (awakening.stage === 9) extinct = true;
  }

  if (extinct) creature.alive = false;

  const result: EraResult = {
    eraIndex: era.index,
    stress: roundStress(stress.total),
    mutations,
    triggeredMilestones: [], // step 4 で追加予定
    emotionStage: creature.emotionAwakening,
    extinct,
    narrative: composeNarrative(era, stress, mutations, extinct, awakening.event),
  };

  creature.eraHistory.push(result);
  return result;
}

/**
 * 6エラを順に処理し、最終生物を返す。途中で絶滅したらそこで停止。
 * 入力の creature は変更しない（ディープコピーして処理）。
 */
export function simulateAll(
  initialCreature: Creature,
  eras: readonly Era[],
): Creature {
  const creature = cloneCreature(initialCreature);

  for (const era of eras) {
    if (!creature.alive) break;
    simulateEra(creature, era);
  }

  return creature;
}

function cloneCreature(c: Creature): Creature {
  return {
    params: { ...c.params },
    categories: { ...c.categories },
    phenomena: [...c.phenomena],
    milestones: [...c.milestones],
    relations: {
      predators: [...c.relations.predators],
      symbionts: [...c.relations.symbionts],
    },
    emotionAwakening: c.emotionAwakening,
    alive: c.alive,
    eraHistory: [...c.eraHistory],
  };
}

function roundStress(v: number): number {
  return Math.round(v * 10) / 10;
}

function composeNarrative(
  era: Era,
  stress: StressBreakdown,
  mutations: Mutation[],
  extinct: boolean,
  awakeningEvent?: string,
): string {
  if (extinct && awakeningEvent) {
    return `${era.biomeLabel}にて、${awakeningEvent}が訪れ、ついに絶えた。`;
  }
  if (extinct) {
    return `${era.biomeLabel}は厳しすぎた。適応しきれず、その系譜はここで絶えた。`;
  }
  if (mutations.length === 0) {
    return `${era.biomeLabel}には、ほとんど苦もなく馴染んだ。`;
  }
  const names = mutations.map((m) => m.phenomenon).join("・");
  const tension = stress.total > HEAVY_MUTATE_THRESHOLD
    ? "激しく揺さぶられながら"
    : stress.total > MUTATE_THRESHOLD
      ? "痛みを伴いながら"
      : "ゆっくりと";
  const tail = awakeningEvent ? `。そして${awakeningEvent}が兆した` : "";
  return `${era.biomeLabel}を生き抜くため、${tension}${names}が起きた${tail}。`;
}
