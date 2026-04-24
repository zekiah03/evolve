import type { MilestoneRule } from "../types";

// ====================================================================
// 進化マイルストーン
//
// 特定のパラメータ／カテゴリの組み合わせで発火する「現象名」。
// 一度発火したら再発火しない（Creature.milestones に記録される）。
// ====================================================================

export const MILESTONES: ReadonlyArray<MilestoneRule> = [
  // ==================== 感覚 ====================
  {
    id: "echolocation",
    name: "反響定位の獲得",
    group: "感覚",
    paramConditions: [
      { param: "vision", max: 0 },
      { param: "hearing", min: 1 },
      { param: "sixthSense", min: 1 },
    ],
  },
  {
    id: "electricVision",
    name: "電流視",
    group: "感覚",
    paramConditions: [{ param: "electricSense", min: 2 }],
  },
  {
    id: "magneticMap",
    name: "磁気地図",
    group: "感覚",
    paramConditions: [
      { param: "magneticSense", min: 1 },
      { param: "memory", min: 1 },
    ],
  },
  {
    id: "weatherSight",
    name: "天候予知",
    group: "感覚",
    paramConditions: [
      { param: "pressureSense", min: 1 },
      { param: "timeSense", min: 1 },
    ],
  },
  {
    id: "memoryOfEarth",
    name: "大地の記憶",
    group: "感覚",
    paramConditions: [
      { param: "vibrationSense", min: 1 },
      { param: "memory", min: 1 },
    ],
  },
  {
    id: "starReading",
    name: "星読み",
    group: "感覚",
    paramConditions: [
      { param: "vision", min: 1 },
      { param: "intelligence", min: 1 },
    ],
    categoryConditions: [{ category: "movementLayer", in: ["樹上", "空中"] }],
  },
  {
    id: "scentLanguage",
    name: "匂いの言語",
    group: "感覚",
    paramConditions: [
      { param: "smell", min: 2 },
      { param: "communication", min: 1 },
    ],
  },
  {
    id: "synesthesia",
    name: "共感覚",
    group: "感覚",
    paramConditions: [
      { param: "vision", min: 1 },
      { param: "hearing", min: 1 },
      { param: "beauty", min: 1 },
    ],
  },
  {
    id: "infrared",
    name: "熱視の獲得",
    group: "感覚",
    paramConditions: [{ param: "thermalSense", min: 2 }],
  },

  // ==================== 身体 ====================
  {
    id: "invisibility",
    name: "透明化",
    group: "身体",
    paramConditions: [
      { param: "mimicry", min: 2 },
      { param: "size", max: 0 },
    ],
    categoryConditions: [
      { category: "coloration", in: ["透明"] },
    ],
  },
  {
    id: "immovableCastle",
    name: "不動の城",
    group: "身体",
    paramConditions: [{ param: "size", min: 1 }],
    categoryConditions: [{ category: "bodyCovering", in: ["殻"] }],
  },
  {
    id: "aquaticArrow",
    name: "水中の矢",
    group: "身体",
    paramConditions: [
      { param: "bodyRatio", min: 1 },
      { param: "moveSpeed", min: 1 },
      { param: "swimming", min: 1 },
    ],
  },
  {
    id: "floatingLife",
    name: "浮遊生物",
    group: "身体",
    paramConditions: [
      { param: "size", max: -1 },
      { param: "flight", min: 1 },
      { param: "pressureSense", min: 1 },
    ],
  },
  {
    id: "shortLivedBeast",
    name: "短命の巨獣",
    group: "身体",
    paramConditions: [
      { param: "size", min: 2 },
      { param: "metabolism", min: 1 },
      { param: "lifespan", max: -1 },
    ],
  },
  {
    id: "miniatureRest",
    name: "矮小化の安息",
    group: "身体",
    paramConditions: [
      { param: "size", max: -2 },
      { param: "metabolism", max: -1 },
      { param: "stillness", min: 1 },
    ],
  },
  {
    id: "eternalMolt",
    name: "永生の脱皮者",
    group: "身体",
    paramConditions: [
      { param: "regeneration", min: 1 },
      { param: "lifespan", min: 1 },
    ],
    categoryConditions: [{ category: "skeleton", in: ["外骨格"] }],
  },
  {
    id: "twoHeaded",
    name: "双頭化",
    group: "身体",
    categoryConditions: [{ category: "symmetry", in: ["非対称"] }],
  },
  {
    id: "tentacled",
    name: "触手化",
    group: "身体",
    paramConditions: [{ param: "limbs", min: 2 }],
    categoryConditions: [{ category: "skeleton", in: ["軟体"] }],
  },
  {
    id: "colonyBeing",
    name: "群体化",
    group: "身体",
    paramConditions: [
      { param: "parallelism", min: 1 },
      { param: "symbiosis", min: 1 },
    ],
  },

  // ==================== 知性 ====================
  {
    id: "fireDiscovery",
    name: "火の発見",
    group: "知性",
    paramConditions: [
      { param: "intelligence", min: 2 },
      { param: "toolUse", min: 1 },
      { param: "culture", min: 1 },
    ],
  },
  {
    id: "stoneAge",
    name: "石器時代",
    group: "知性",
    paramConditions: [
      { param: "intelligence", min: 2 },
      { param: "toolUse", min: 2 },
      { param: "division", min: 1 },
    ],
  },
  {
    id: "languageBirth",
    name: "言語の誕生",
    group: "知性",
    paramConditions: [
      { param: "communication", min: 2 },
      { param: "intelligence", min: 1 },
      { param: "culture", min: 1 },
    ],
  },
  {
    id: "artBirth",
    name: "芸術の誕生",
    group: "知性",
    paramConditions: [
      { param: "creativity", min: 1 },
      { param: "beauty", min: 1 },
      { param: "culture", min: 1 },
    ],
  },
  {
    id: "numberConcept",
    name: "数の概念",
    group: "知性",
    paramConditions: [
      { param: "intelligence", min: 2 },
      { param: "memory", min: 1 },
      { param: "timeSense", min: 1 },
    ],
  },
  {
    id: "mapping",
    name: "地図化",
    group: "知性",
    paramConditions: [
      { param: "magneticSense", min: 1 },
      { param: "vision", min: 1 },
      { param: "memory", min: 1 },
    ],
  },
  {
    id: "agriculture",
    name: "農業の発明",
    group: "知性",
    paramConditions: [
      { param: "intelligence", min: 2 },
      { param: "division", min: 1 },
      { param: "sociality", min: 1 },
    ],
  },
  {
    id: "architecture",
    name: "建築",
    group: "知性",
    paramConditions: [
      { param: "toolUse", min: 1 },
      { param: "sociality", min: 1 },
      { param: "creativity", min: 1 },
    ],
  },
  {
    id: "writing",
    name: "文字の発明",
    group: "知性",
    paramConditions: [
      { param: "memory", min: 2 },
      { param: "communication", min: 2 },
      { param: "culture", min: 2 },
    ],
  },
  {
    id: "spaceEscape",
    name: "星への脱出",
    group: "知性",
    paramConditions: [
      { param: "intelligence", min: 2 },
      { param: "toolUse", min: 2 },
      { param: "culture", min: 2 },
    ],
    categoryConditions: [{ category: "movementLayer", in: ["空中"] }],
  },

  // ==================== 社会 ====================
  {
    id: "superOrganism",
    name: "超個体",
    group: "社会",
    paramConditions: [
      { param: "groupSize", min: 2 },
      { param: "division", min: 2 },
      { param: "hierarchy", min: 2 },
    ],
  },
  {
    id: "lonelyWise",
    name: "孤高の賢者",
    group: "社会",
    paramConditions: [
      { param: "sociality", max: -2 },
      { param: "intelligence", min: 2 },
    ],
  },
  {
    id: "symbiotic",
    name: "共棲種",
    group: "社会",
    paramConditions: [
      { param: "symbiosis", min: 2 },
      { param: "symbiontCount", min: 1 },
    ],
  },
  {
    id: "parasite",
    name: "寄生種",
    group: "社会",
    paramConditions: [
      { param: "symbiosis", min: 1 },
      { param: "aggression", max: 0 },
      { param: "size", max: -1 },
    ],
  },
  {
    id: "cannibalism",
    name: "共食い化",
    group: "社会",
    paramConditions: [
      { param: "sociality", max: -1 },
      { param: "aggression", min: 1 },
    ],
    categoryConditions: [{ category: "diet", in: ["肉"] }],
  },

  // ==================== 繁殖 ====================
  {
    id: "immortal",
    name: "不老不死",
    group: "繁殖",
    paramConditions: [
      { param: "lifespan", min: 2 },
      { param: "regeneration", min: 2 },
    ],
  },
  {
    id: "virginBirth",
    name: "処女受胎",
    group: "繁殖",
    categoryConditions: [
      { category: "reproMode", in: ["単為"] },
      { category: "sexStructure", in: ["単一", "同体"] },
    ],
  },
  {
    id: "metamorphosis",
    name: "完全変態",
    group: "繁殖",
    categoryConditions: [{ category: "reproMode", in: ["変態"] }],
  },
  {
    id: "deathForChildren",
    name: "子のための死",
    group: "繁殖",
    paramConditions: [
      { param: "nurturing", min: 2 },
      { param: "lifespan", max: -1 },
    ],
  },
  {
    id: "sexSelectionExtreme",
    name: "性淘汰の極み",
    group: "繁殖",
    paramConditions: [
      { param: "courtship", min: 2 },
      { param: "colorRichness", min: 1 },
    ],
  },
  {
    id: "innerWorld",
    name: "胎内宇宙",
    group: "繁殖",
    paramConditions: [{ param: "nurturing", min: 2 }],
    categoryConditions: [{ category: "reproMode", in: ["胎生"] }],
  },

  // ==================== 生化学 ====================
  {
    id: "becomingPlant",
    name: "植物化",
    group: "生化学",
    paramConditions: [
      { param: "photosynthesis", min: 2 },
      { param: "moveSpeed", max: -1 },
      { param: "lifespan", min: 1 },
    ],
  },
  {
    id: "abandonAnimality",
    name: "動物性の放棄",
    group: "生化学",
    paramConditions: [
      { param: "photosynthesis", min: 1 },
      { param: "symbiosis", min: 1 },
      { param: "moveSpeed", max: -2 },
    ],
  },
  {
    id: "kingOfCarrion",
    name: "腐肉の王",
    group: "生化学",
    paramConditions: [
      { param: "detoxification", min: 2 },
      { param: "foodChainPosition", min: 1 },
    ],
    categoryConditions: [{ category: "diet", in: ["腐"] }],
  },
  {
    id: "walkingEcosystem",
    name: "動く生態系",
    group: "生化学",
    paramConditions: [
      { param: "symbiosis", min: 2 },
      { param: "symbiontCount", min: 2 },
    ],
  },
  {
    id: "poisonPurification",
    name: "毒の純化",
    group: "生化学",
    paramConditions: [
      { param: "toxicity", min: 2 },
      { param: "detoxification", min: 2 },
    ],
  },
  {
    id: "eatingLight",
    name: "光を食う種",
    group: "生化学",
    paramConditions: [
      { param: "photosynthesis", min: 2 },
      { param: "vision", min: 2 },
    ],
  },

  // ==================== 極限 ====================
  {
    id: "eternalSleep",
    name: "永遠の眠り",
    group: "極限",
    paramConditions: [
      { param: "dormancy", min: 2 },
      { param: "drought", min: 1 },
      { param: "lowTemp", min: 1 },
      { param: "radiation", min: 1 },
    ],
  },
  {
    id: "childOfRadiation",
    name: "放射線の子",
    group: "極限",
    paramConditions: [
      { param: "radiation", min: 2 },
      { param: "generationCycle", min: 1 },
    ],
  },
  {
    id: "abyssDweller",
    name: "深淵の住人",
    group: "極限",
    paramConditions: [
      { param: "pressureRes", min: 2 },
      { param: "sixthSense", min: 1 },
      { param: "lowTemp", min: 1 },
    ],
    categoryConditions: [{ category: "movementLayer", in: ["水中"] }],
  },
  {
    id: "polarWise",
    name: "極地の賢者",
    group: "極限",
    paramConditions: [
      { param: "lowTemp", min: 2 },
      { param: "lifespan", min: 1 },
      { param: "intelligence", min: 1 },
    ],
  },
  {
    id: "volcanoChild",
    name: "火山の子",
    group: "極限",
    paramConditions: [
      { param: "highTemp", min: 2 },
      { param: "detoxification", min: 1 },
    ],
    categoryConditions: [{ category: "movementLayer", in: ["地中"] }],
  },
  {
    id: "saltCrystallization",
    name: "塩の結晶化",
    group: "極限",
    paramConditions: [
      { param: "salinity", min: 2 },
      { param: "metabolism", max: -2 },
    ],
  },

  // ==================== 物語 ====================
  {
    id: "legendary",
    name: "伝説化",
    group: "物語",
    paramConditions: [
      { param: "holiness", min: 2 },
      { param: "lifespan", min: 1 },
      { param: "beauty", min: 1 },
    ],
  },
  {
    id: "ghostSpecies",
    name: "幽霊種",
    group: "物語",
    paramConditions: [
      { param: "stillness", min: 2 },
      { param: "mimicry", min: 1 },
    ],
  },
  {
    id: "beloved",
    name: "愛される種",
    group: "物語",
    paramConditions: [
      { param: "beauty", min: 2 },
      { param: "voiceDepth", min: 1 },
      { param: "colorRichness", min: 1 },
    ],
  },
  {
    id: "chronicler",
    name: "語り部",
    group: "物語",
    paramConditions: [
      { param: "memory", min: 2 },
      { param: "lifespan", min: 1 },
      { param: "loneliness", min: 1 },
    ],
  },
  {
    id: "poetSpecies",
    name: "詩人種",
    group: "物語",
    paramConditions: [
      { param: "voiceDepth", min: 2 },
      { param: "creativity", min: 1 },
    ],
  },
  {
    id: "starChild",
    name: "星の子",
    group: "物語",
    paramConditions: [
      { param: "vision", min: 2 },
      { param: "intelligence", min: 1 },
    ],
    categoryConditions: [{ category: "movementLayer", in: ["空中"] }],
  },
  {
    id: "timeKeeper",
    name: "時の監視者",
    group: "物語",
    paramConditions: [
      { param: "timeSense", min: 2 },
      { param: "memory", min: 1 },
      { param: "lifespan", min: 1 },
    ],
  },

  // ==================== 退化 ====================
  {
    id: "beautyOfDecline",
    name: "退化の美",
    group: "退化",
    paramConditions: [
      { param: "vision", max: -1 },
      { param: "hearing", max: -1 },
      { param: "intelligence", max: -1 },
      { param: "moveSpeed", max: -1 },
    ],
  },
  {
    id: "primalReturn",
    name: "原始回帰",
    group: "退化",
    paramConditions: [{ param: "intelligence", max: -1 }],
    categoryConditions: [{ category: "symmetry", in: ["放射"] }],
  },
  {
    id: "livingFossil",
    name: "生きた化石",
    group: "退化",
    paramConditions: [
      { param: "metabolism", max: -1 },
      { param: "lifespan", min: 2 },
    ],
  },
  {
    id: "mushroomize",
    name: "きのこ化",
    group: "退化",
    categoryConditions: [
      { category: "reproMode", in: ["分裂"] },
      { category: "movementLayer", in: ["地中", "地表"] },
    ],
  },
  {
    id: "coralize",
    name: "珊瑚化",
    group: "退化",
    paramConditions: [
      { param: "moveSpeed", max: -2 },
      { param: "sociality", min: 1 },
    ],
    categoryConditions: [{ category: "skeleton", in: ["外骨格"] }],
  },
  {
    id: "virusize",
    name: "ウイルス化",
    group: "退化",
    paramConditions: [
      { param: "size", max: -2 },
      { param: "reproStrategy", min: 2 },
      { param: "symbiosis", min: 1 },
    ],
  },
  {
    id: "crystallize",
    name: "結晶化",
    group: "退化",
    paramConditions: [
      { param: "salinity", min: 1 },
      { param: "metabolism", max: -2 },
    ],
    categoryConditions: [{ category: "symmetry", in: ["放射"] }],
  },

  // ==================== ハイブリッド ====================
  {
    id: "amphibian",
    name: "水陸両用",
    group: "ハイブリッド",
    paramConditions: [
      { param: "swimming", min: 1 },
      { param: "climbing", min: 1 },
    ],
  },
  {
    id: "universal",
    name: "陸海空完全制覇",
    group: "ハイブリッド",
    paramConditions: [
      { param: "swimming", min: 1 },
      { param: "flight", min: 1 },
      { param: "digging", min: 1 },
    ],
  },
  {
    id: "plantAnimalBorder",
    name: "植物動物の境界",
    group: "ハイブリッド",
    paramConditions: [
      { param: "photosynthesis", min: 1 },
      { param: "moveSpeed", min: 0 },
    ],
  },
  {
    id: "shapeshifter",
    name: "万能変身",
    group: "ハイブリッド",
    paramConditions: [
      { param: "mimicry", min: 2 },
      { param: "regeneration", min: 1 },
    ],
  },

  // ==================== 超進化 ====================
  {
    id: "mechanicalLife",
    name: "機械生命化",
    group: "超進化",
    paramConditions: [
      { param: "intelligence", min: 2 },
      { param: "toolUse", min: 2 },
      { param: "lifespan", min: 2 },
    ],
    categoryConditions: [{ category: "bodyCovering", in: ["殻"] }],
  },
  {
    id: "consciousnessUpload",
    name: "意識のアップロード",
    group: "超進化",
    paramConditions: [
      { param: "intelligence", min: 2 },
      { param: "memory", min: 2 },
      { param: "culture", min: 2 },
    ],
  },
] as const;

export const MILESTONE_MAP: Readonly<Record<string, MilestoneRule>> =
  Object.fromEntries(MILESTONES.map((m) => [m.id, m]));
