import { MILESTONE_MAP } from "../data/milestones";
import type { Creature, Era } from "../types";

// ====================================================================
// 最終生物の詩的な肖像を生成する
//
// - 名前は「{マイルストーン形容}{特質形容}{種別}」の合成
// - 説明文は最終バイオーム・感覚優位・社会性・感情段階から編む
// ====================================================================

export type CreaturePortrait = {
  /** 合成された種名（例: 「闇を聴く孤高の甲殻の穴居者」） */
  name: string;
  /** 種別（例:「樹上の獣」「深みの者」） */
  speciesType: string;
  /** 状態を表す一行（生存中 or 絶滅） */
  subtitle: string;
  /** 詩的な一段落の描写 */
  description: string;
  /** 採用した特質形容詞 */
  epithets: string[];
  /** 採用したマイルストーン形容詞（なければ null） */
  milestoneAdjective: string | null;
};

export function generatePortrait(
  creature: Creature,
  eras: Era[],
): CreaturePortrait {
  const finalEra = eras[eras.length - 1];
  const speciesType = speciesTypeFor(creature);
  const epithets = topEpithets(creature);
  const milestoneAdjective = topMilestoneAdjective(creature);

  const name = composeName(epithets, milestoneAdjective, speciesType);
  const subtitle = creature.alive
    ? `${finalEra.biomeLabel}に生きる種`
    : `${finalEra.biomeLabel}にて絶えた種`;
  const description = composeDescription(creature, eras);

  return {
    name,
    speciesType,
    subtitle,
    description,
    epithets,
    milestoneAdjective,
  };
}

// ==================== 種別 ====================

function speciesTypeFor(c: Creature): string {
  const layer = c.categories.movementLayer;
  const cov = c.categories.bodyCovering;

  if (layer === "空中") {
    if (cov === "羽毛") return "翼もの";
    if (cov === "粘膜") return "風の浮遊体";
    if (cov === "裸肌") return "空を舞う影";
    return "空を行く者";
  }
  if (layer === "水中") {
    if (cov === "鱗") return "鱗の泳ぐ者";
    if (cov === "粘膜") return "水棲の軟き者";
    if (cov === "殻") return "甲殻の水棲者";
    if (cov === "毛皮") return "水辺の獣";
    if (cov === "羽毛") return "水を渡る鳥";
    return "深みの者";
  }
  if (layer === "樹上") {
    if (cov === "毛皮") return "樹上の獣";
    if (cov === "羽毛") return "梢の鳥";
    if (cov === "裸肌") return "梢の影";
    if (cov === "鱗") return "枝を這う鱗者";
    return "枝渡る者";
  }
  if (layer === "地中") {
    if (cov === "殻") return "甲殻の穴居者";
    if (cov === "毛皮") return "毛の穴居獣";
    if (cov === "粘膜") return "地中の軟体";
    if (cov === "裸肌") return "地を掘る素肌者";
    return "地を掘る者";
  }
  // 地表
  if (cov === "毛皮") return "獣";
  if (cov === "羽毛") return "地を駆ける鳥";
  if (cov === "鱗") return "鱗の這うもの";
  if (cov === "殻") return "甲殻の歩む者";
  if (cov === "粘膜") return "湿った這うもの";
  if (cov === "裸肌") return "素肌の歩む者";
  return "地の者";
}

// ==================== 形容詞（特質から） ====================

type EpithetRule = {
  when: (c: Creature) => boolean;
  word: string;
};

const EPITHET_RULES: ReadonlyArray<EpithetRule> = [
  { when: (c) => c.params.holiness >= 2, word: "聖なる" },
  { when: (c) => c.params.beauty >= 2, word: "美しき" },
  { when: (c) => c.params.loneliness >= 2, word: "孤高の" },
  { when: (c) => c.params.stillness >= 2, word: "静けき" },
  { when: (c) => c.params.intelligence >= 2, word: "賢き" },
  { when: (c) => c.params.toxicity >= 2, word: "毒ある" },
  { when: (c) => c.params.aggression >= 2, word: "猛き" },
  { when: (c) => c.params.mimicry >= 2, word: "影なき" },
  { when: (c) => c.params.colorRichness >= 2, word: "鮮やかなる" },
  { when: (c) => c.params.sociality >= 2, word: "群れなす" },
  { when: (c) => c.params.nurturing >= 2, word: "慈しみの" },
  { when: (c) => c.params.lifespan >= 2, word: "永き" },
  { when: (c) => c.params.lifespan <= -2, word: "短命の" },
  { when: (c) => c.params.size <= -2, word: "小さき" },
  { when: (c) => c.params.size >= 2, word: "巨きき" },
];

function topEpithets(c: Creature, max = 2): string[] {
  const hits: string[] = [];
  for (const rule of EPITHET_RULES) {
    if (rule.when(c)) hits.push(rule.word);
    if (hits.length >= max) break;
  }
  return hits;
}

// ==================== 形容詞（マイルストーンから） ====================

const MILESTONE_ADJ_MAP: Readonly<Record<string, string>> = {
  echolocation: "闇を聴く",
  electricVision: "電を視る",
  magneticMap: "磁を読む",
  weatherSight: "雲を読む",
  memoryOfEarth: "大地を聴く",
  starReading: "星を読む",
  scentLanguage: "匂いで語る",
  synesthesia: "色と音を混ぜる",
  infrared: "熱を視る",
  invisibility: "姿なき",
  immovableCastle: "動かざる",
  aquaticArrow: "矢と化した",
  floatingLife: "風に浮かぶ",
  shortLivedBeast: "燃え尽きる",
  miniatureRest: "安らぐ小さき",
  eternalMolt: "脱ぎ続ける",
  twoHeaded: "双頭の",
  tentacled: "触手持つ",
  colonyBeing: "群体の",
  fireDiscovery: "火を知る",
  stoneAge: "石を握る",
  languageBirth: "言葉を持つ",
  artBirth: "歌を持つ",
  numberConcept: "数を知る",
  mapping: "世界を描く",
  agriculture: "土を耕す",
  architecture: "巣を組む",
  writing: "記を刻む",
  spaceEscape: "星へ渡った",
  superOrganism: "一体なす",
  lonelyWise: "ひとり賢き",
  symbiotic: "共に生きる",
  parasite: "寄り添う",
  cannibalism: "同族を食む",
  immortal: "老いぬ",
  virginBirth: "独りで産む",
  metamorphosis: "形を変える",
  deathForChildren: "子のために尽きる",
  sexSelectionExtreme: "求愛に燃ゆる",
  innerWorld: "胎に宿す",
  becomingPlant: "動かず育つ",
  abandonAnimality: "動物を捨てた",
  kingOfCarrion: "屍の王",
  walkingEcosystem: "他者を宿す",
  poisonPurification: "毒を純化した",
  eatingLight: "光を食む",
  eternalSleep: "眠り続ける",
  childOfRadiation: "放射の子",
  abyssDweller: "深淵の",
  polarWise: "氷に冴える",
  volcanoChild: "火の子",
  saltCrystallization: "塩に眠る",
  legendary: "伝説となった",
  ghostSpecies: "幽かなる",
  beloved: "愛される",
  chronicler: "記憶を刻む",
  poetSpecies: "歌う",
  starChild: "星に向かう",
  timeKeeper: "時を測る",
  beautyOfDecline: "退きゆく",
  primalReturn: "原初に帰った",
  livingFossil: "生きた化石の",
  mushroomize: "菌となる",
  coralize: "珊瑚なす",
  virusize: "微なる",
  crystallize: "結晶の",
  amphibian: "水陸を渡る",
  universal: "陸海空を往く",
  plantAnimalBorder: "植物に近き",
  shapeshifter: "姿を変える",
  mechanicalLife: "機械となった",
  consciousnessUpload: "肉を捨てた",
};

export function milestoneAdjective(id: string): string | null {
  return MILESTONE_ADJ_MAP[id] ?? null;
}

function topMilestoneAdjective(c: Creature): string | null {
  // 物語グループを優先
  for (const id of c.milestones) {
    const m = MILESTONE_MAP[id];
    if (!m) continue;
    if (m.group === "物語") {
      const adj = MILESTONE_ADJ_MAP[id];
      if (adj) return adj;
    }
  }
  for (const id of c.milestones) {
    const adj = MILESTONE_ADJ_MAP[id];
    if (adj) return adj;
  }
  return null;
}

// ==================== 合成 ====================

function composeName(
  epithets: string[],
  milestoneAdj: string | null,
  speciesType: string,
): string {
  const parts: string[] = [];
  if (milestoneAdj) parts.push(milestoneAdj);
  parts.push(...epithets);
  parts.push(speciesType);
  return parts.join("");
}

function composeDescription(c: Creature, eras: Era[]): string {
  const lastEra = eras[eras.length - 1];
  const biome = lastEra.biomeLabel;

  const sizePhrase =
    c.params.size >= 2
      ? "巨きな体"
      : c.params.size <= -2
        ? "ごく小さな体"
        : "人知れぬ大きさの体";

  const lifespanAdv =
    c.params.lifespan >= 2
      ? "世代を越えて"
      : c.params.lifespan <= -1
        ? "短く燃え尽きるように"
        : "静かに";

  const sentences: string[] = [];
  sentences.push(
    `${biome}に、${sizePhrase}の${c.categories.bodyCovering}をまとった生き物が${lifespanAdv}在る。`,
  );

  // 感覚
  if (c.params.vision <= -1 && c.params.hearing >= 1) {
    sentences.push("視覚はすでに眠り、音と振動だけで世界を聴いている。");
  } else if (c.params.vision >= 2) {
    sentences.push("遠くを見通す目で、世界の輪郭を辛うじて保っている。");
  } else if (c.params.smell >= 2) {
    sentences.push("匂いで記憶を編み、遠い過去と繋がっている。");
  } else if (c.params.echolocation >= 1) {
    sentences.push("反響する音を地図にして、闇の中を泳ぎ歩く。");
  }

  // 社会
  if (c.params.sociality >= 2) {
    sentences.push("群れとしての体温を持ち、他と熱量を分かち合っている。");
  } else if (c.params.sociality <= -2) {
    sentences.push("ひとりで在り、ひとりで終わる。");
  }

  // 知性／感情の兆し
  if (c.emotionAwakening >= 5) {
    sentences.push("けれど、感情の色がすでに彼らの中に芽吹いてしまった。");
  } else if (c.emotionAwakening >= 1) {
    sentences.push("わずかに、内側の何かが動き始めている。");
  }

  // 結び
  if (!c.alive && c.emotionAwakening >= 9) {
    sentences.push("ついに「自己」という重さに耐えきれず、その系譜は絶えた。");
  } else if (!c.alive) {
    sentences.push("環境は厳しすぎた。そこで彼らは途絶えた。");
  } else if (c.emotionAwakening >= 5) {
    sentences.push("感情を持たぬはずの生物が、感情を持ちかけたまま、今もそこにいる。");
  } else {
    sentences.push("感情を持たぬまま、彼らは今もそこにいる。");
  }

  return sentences.join("");
}
