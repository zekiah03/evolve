import { PARAM_MAP } from "../data/parameters";
import type {
  CategoryId,
  CategoryValues,
  Creature,
  Era,
  Mutation,
} from "../types";

function clamp(v: number, min = -2, max = 2): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * ストレス寄与の大きいパラメータを count 個選び、目標値に +1 近づける変異を生成。
 */
export function selectParamMutations(
  creature: Creature,
  era: Era,
  count: number,
): Mutation[] {
  const diffs = era.requirements
    .map((req) => {
      const current = creature.params[req.param] ?? 0;
      const diff = Math.abs(current - req.target) * req.weight;
      return { req, current, diff };
    })
    .filter((d) => d.diff > 0)
    .sort((a, b) => b.diff - a.diff);

  return diffs.slice(0, count).map(({ req, current }) => {
    const delta = current < req.target ? 1 : -1;
    const meta = PARAM_MAP[req.param];
    const phenomenon =
      delta > 0
        ? (meta.increasePhenomenon ?? `${meta.label}向上`)
        : (meta.decreasePhenomenon ?? `${meta.label}退化`);
    return {
      paramId: req.param,
      delta,
      phenomenon,
    };
  });
}

/**
 * カテゴリ要求を満たしていないものを、最初の preferred 値へ変更する変異を生成。
 */
export function selectCategoryMutations(
  creature: Creature,
  era: Era,
  maxCount = Infinity,
): Mutation[] {
  const mutations: Mutation[] = [];
  for (const creq of era.categoryRequirements) {
    if (mutations.length >= maxCount) break;
    const current = creature.categories[creq.category] as string;
    if (creq.preferred.includes(current)) continue;
    const target = creq.preferred[0];
    if (!target) continue;
    mutations.push({
      categoryId: creq.category,
      newValue: target,
      phenomenon: categoryChangePhenomenon(creq.category, target),
    });
  }
  return mutations;
}

const CATEGORY_PHENOMENON_MAP: Readonly<Record<string, string>> = {
  "bodyCovering->粘膜": "軟化",
  "bodyCovering->裸肌": "裸化",
  "bodyCovering->鱗": "鱗化",
  "bodyCovering->殻": "硬質化",
  "bodyCovering->毛皮": "毛皮化",
  "bodyCovering->羽毛": "羽毛化",
  "skeleton->外骨格": "外骨格化",
  "skeleton->内骨格": "内骨格化",
  "skeleton->軟体": "軟体化",
  "skeleton->硬皮": "硬皮化",
  "symmetry->放射": "放射対称化",
  "symmetry->左右": "左右対称化",
  "symmetry->非対称": "非対称化",
  "bodyTempType->冷血": "冷血化",
  "bodyTempType->恒温": "恒温化",
  "bodyTempType->中間": "中温化",
  "coloration->保護色": "保護色化",
  "coloration->警告色": "警告化",
  "coloration->派手": "派手化",
  "coloration->透明": "透明化",
  "movementLayer->地中": "地下化",
  "movementLayer->水中": "水棲化",
  "movementLayer->地表": "地表化",
  "movementLayer->樹上": "樹上化",
  "movementLayer->空中": "翼化",
  "reproMode->卵生": "卵生化",
  "reproMode->胎生": "胎生化",
  "reproMode->分裂": "分裂繁殖化",
  "reproMode->単為": "単為生殖化",
  "reproMode->変態": "完全変態化",
  "sexStructure->雌雄": "雌雄分化",
  "sexStructure->同体": "雌雄同体化",
  "sexStructure->多性": "多性化",
  "sexStructure->単一": "単一性化",
  "diet->草": "草食化",
  "diet->肉": "肉食化",
  "diet->腐": "腐食化",
  "diet->雑": "雑食化",
  "diet->光合成": "葉緑化",
  "attackType->噛": "鋭牙化",
  "attackType->爪": "鉤爪化",
  "attackType->打": "打撃化",
  "attackType->毒": "毒化",
  "attackType->音波": "音波攻撃化",
  "defenseType->装甲": "鎧化",
  "defenseType->速度": "俊足防御化",
  "defenseType->擬態": "擬態化",
  "defenseType->群れ": "群れ防御化",
  "defenseType->毒": "毒防御化",
};

function categoryChangePhenomenon(catId: CategoryId, to: string): string {
  return CATEGORY_PHENOMENON_MAP[`${catId}->${to}`] ?? `${to}化`;
}

/**
 * 変異を creature に適用する（破壊的）。
 */
export function applyMutation(creature: Creature, m: Mutation): void {
  if (m.paramId != null && m.delta != null) {
    const cur = creature.params[m.paramId] ?? 0;
    creature.params[m.paramId] = clamp(cur + m.delta);
  }
  if (m.categoryId != null && m.newValue != null) {
    setCategory(creature, m.categoryId, m.newValue);
  }
  creature.phenomena.push(m.phenomenon);
}

function setCategory<K extends CategoryId>(
  creature: Creature,
  key: K,
  value: string,
): void {
  (creature.categories as { [P in CategoryId]: CategoryValues[P] })[key] =
    value as CategoryValues[K];
}
