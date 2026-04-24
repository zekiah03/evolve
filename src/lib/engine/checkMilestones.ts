import { MILESTONES } from "../data/milestones";
import type { Creature, MilestoneRule } from "../types";

/**
 * 生物の現在状態を見て、未発火のマイルストーンが今発火しうるか判定。
 * 発火したマイルストーンは creature.milestones と creature.phenomena に
 * 記録し、発火名のリストを返す（そのエラ分として simulator で使う）。
 */
export function checkMilestones(creature: Creature): string[] {
  const fired: string[] = [];
  for (const m of MILESTONES) {
    if (creature.milestones.includes(m.id)) continue;
    if (!satisfies(creature, m)) continue;
    creature.milestones.push(m.id);
    creature.phenomena.push(m.name);
    fired.push(m.name);
  }
  return fired;
}

function satisfies(creature: Creature, m: MilestoneRule): boolean {
  if (m.paramConditions) {
    for (const cond of m.paramConditions) {
      const v = creature.params[cond.param] ?? 0;
      if (cond.min != null && v < cond.min) return false;
      if (cond.max != null && v > cond.max) return false;
    }
  }
  if (m.categoryConditions) {
    for (const cond of m.categoryConditions) {
      const v = creature.categories[cond.category] as string;
      if (!cond.in.includes(v)) return false;
    }
  }
  return true;
}
