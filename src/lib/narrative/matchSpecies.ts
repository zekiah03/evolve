import { SPECIES_ATLAS } from "../data/speciesAtlas";
import type {
  CategoryId,
  Creature,
  ParamId,
  SpeciesFingerprint,
} from "../types";

// ====================================================================
// 進化結果と最も近い実在生物を選ぶ
//
// マンハッタン距離ベース：
//   - 数値パラメータは |creature - 種典型| を加算
//   - 種が指定したパラメータだけを比較対象にする（その種の指紋）
//   - カテゴリ不一致は固定ペナルティ
// 距離が近いほど「近縁」、上位 N 種を返す。
// ====================================================================

const CATEGORY_MISMATCH_COST = 1.5;

export type SpeciesMatch = SpeciesFingerprint & { distance: number };

export function findClosestSpecies(
  creature: Creature,
  topN = 3,
): SpeciesMatch[] {
  return SPECIES_ATLAS.map((sp) => ({
    ...sp,
    distance: distanceTo(creature, sp),
  }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, topN);
}

function distanceTo(creature: Creature, sp: SpeciesFingerprint): number {
  let d = 0;

  for (const [param, target] of Object.entries(sp.params) as Array<
    [ParamId, number]
  >) {
    const cur = creature.params[param] ?? 0;
    d += Math.abs(cur - target);
  }

  if (sp.categories) {
    for (const [cat, val] of Object.entries(sp.categories) as Array<
      [CategoryId, string]
    >) {
      if ((creature.categories[cat] as string) !== val) {
        d += CATEGORY_MISMATCH_COST;
      }
    }
  }

  return d;
}
