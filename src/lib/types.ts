// ==================== Axes ====================

export type EmotionAxisId =
  | "expression" // 表出: 発散(+) / 内包(-)
  | "speed" //     速度: 即応(+) / 熟慮(-)
  | "distance" //  距離: 共感(+) / 独立(-)
  | "direction" // 方向: 攻撃(+) / 防御(-)
  | "fuel" //      燃料化: 駆動(+) / 回避(-)
  | "conformity"; // 同調: 同化(+) / 独自(-)

export type EnvironmentAxisId =
  | "temperature" // 温暖(+) / 寒冷(-)
  | "humidity" //    湿潤(+) / 乾燥(-)
  | "light" //       明(+)   / 暗(-)
  | "altitude" //    高(+)   / 低(-)
  | "space" //       開放(+) / 閉鎖(-)
  | "volatility"; // 激変(+) / 安定(-)

export type AxisValue = -2 | -1 | 0 | 1 | 2;
export type AxisDelta = -1 | 1;

export type AxisProfile<AxisId extends string> = Record<AxisId, AxisValue>;
export type EmotionProfile = AxisProfile<EmotionAxisId>;
export type EnvironmentProfile = AxisProfile<EnvironmentAxisId>;

export type AxisMeta<AxisId extends string> = {
  id: AxisId;
  label: string;
  positive: string; // 正方向ラベル
  negative: string; // 負方向ラベル
};

// ==================== Questions ====================

export type ChoiceLabel = "A" | "B" | "C" | "D";

export type Choice<AxisId extends string> = {
  label: ChoiceLabel;
  text: string;
  effects: Array<{ axis: AxisId; delta: AxisDelta }>;
};

export type Question<AxisId extends string> = {
  id: string;
  index: 1 | 2 | 3 | 4 | 5 | 6;
  category?: string; // 「立体ニッチ」など、エラの別名
  prompt: string;
  choices: readonly [
    Choice<AxisId>,
    Choice<AxisId>,
    Choice<AxisId>,
    Choice<AxisId>,
  ];
};

export type EmotionQuestion = Question<EmotionAxisId>;
export type EnvironmentQuestion = Question<EnvironmentAxisId>;

// ==================== Parameters (continuous) ====================

export type ParamId =
  // 体
  | "size"
  | "metabolism"
  | "lifespan"
  | "regeneration"
  | "toxicity"
  | "mimicry"
  | "limbs"
  | "bodyRatio"
  // 感覚
  | "vision"
  | "hearing"
  | "smell"
  | "touch"
  | "taste"
  | "sixthSense"
  | "magneticSense"
  | "electricSense"
  | "vibrationSense"
  | "thermalSense"
  | "pressureSense"
  | "timeSense"
  | "echolocation"
  // 運動
  | "moveSpeed"
  | "endurance"
  | "burst"
  | "jumping"
  | "swimming"
  | "flight"
  | "climbing"
  | "digging"
  // 知性
  | "intelligence"
  | "memory"
  | "learning"
  | "curiosity"
  | "wariness"
  | "play"
  | "toolUse"
  | "communication"
  | "culture"
  | "creativity"
  | "introspection"
  // 繁殖
  | "reproStrategy"
  | "nurturing"
  | "courtship"
  | "genInterval"
  // 社会
  | "sociality"
  | "groupSize"
  | "hierarchy"
  | "division"
  | "territoriality"
  // 生化学
  | "photosynthesis"
  | "symbiosis"
  | "dormancy"
  | "detoxification"
  // 耐性
  | "lowOxygen"
  | "lowTemp"
  | "highTemp"
  | "salinity"
  | "pressureRes"
  | "drought"
  | "radiation"
  // 攻防
  | "aggression"
  | "intimidation"
  // 物語
  | "voiceDepth"
  | "colorRichness"
  | "scentIdentity"
  | "stillness"
  | "presence"
  | "beauty"
  | "holiness"
  | "loneliness"
  | "totalMemory"
  // 時空
  | "timeStop"
  | "generationCycle"
  | "parallelism"
  | "periodicSleep"
  | "sporeCapability"
  | "fossilTransmigration"
  // 他種関係
  | "predatorLineage"
  | "symbiontCount"
  | "foodChainPosition"
  // 環境改変
  | "envModify"
  | "envModifySpeed";

// ==================== Parameters (categorical) ====================

export type CategoryValues = {
  bodyCovering: "粘膜" | "裸肌" | "鱗" | "殻" | "毛皮" | "羽毛";
  skeleton: "外骨格" | "内骨格" | "軟体" | "硬皮";
  symmetry: "放射" | "左右" | "非対称";
  bodyTempType: "冷血" | "恒温" | "中間";
  coloration: "保護色" | "警告色" | "派手" | "透明";
  movementLayer: "地中" | "水中" | "地表" | "樹上" | "空中";
  reproMode: "卵生" | "胎生" | "分裂" | "単為" | "変態";
  sexStructure: "雌雄" | "同体" | "多性" | "単一";
  diet: "草" | "肉" | "腐" | "雑" | "光合成";
  attackType: "噛" | "爪" | "打" | "毒" | "音波";
  defenseType: "装甲" | "速度" | "擬態" | "群れ" | "毒";
};

export type CategoryId = keyof CategoryValues;

export type ParamGroup =
  | "体"
  | "感覚"
  | "運動"
  | "知性"
  | "繁殖"
  | "社会"
  | "生化学"
  | "耐性"
  | "攻防"
  | "物語"
  | "時空"
  | "他種関係"
  | "環境改変";

export type ParamMeta = {
  id: ParamId;
  label: string;
  group: ParamGroup;
  defaultValue: number;
  // 低極・高極の現象名（例: サイズ → "矮小化" / "肥大"）
  decreasePhenomenon?: string;
  increasePhenomenon?: string;
};

export type CategoryMeta = {
  id: CategoryId;
  label: string;
  group: ParamGroup;
  values: readonly string[];
  defaultValue: string;
};

// ==================== Species Atlas ====================

export type SpeciesGroup =
  | "哺乳類"
  | "鳥類"
  | "爬虫類"
  | "両生類"
  | "魚類"
  | "軟体動物"
  | "節足動物"
  | "甲殻類"
  | "棘皮動物"
  | "刺胞動物"
  | "環形動物"
  | "微生物"
  | "植物"
  | "菌類";

export type SpeciesFingerprint = {
  id: string;
  name: string;
  group: SpeciesGroup;
  /** 短い詩的な見出し（例: 「氷の影」「永遠の眠り」） */
  epithet: string;
  /** 各パラメータの「典型値」。書かなかった項目は0扱い。 */
  params: Partial<Record<ParamId, number>>;
  /** 体表・移動層など、その種の象徴的なカテゴリだけ書く。 */
  categories?: Partial<{ [K in CategoryId]: CategoryValues[K] }>;
};

// ==================== Milestones ====================

export type MilestoneGroup =
  | "感覚"
  | "身体"
  | "知性"
  | "社会"
  | "繁殖"
  | "生化学"
  | "極限"
  | "物語"
  | "退化"
  | "ハイブリッド"
  | "超進化";

export type ParamCondition = {
  param: ParamId;
  min?: number;
  max?: number;
};

export type CategoryCondition = {
  category: CategoryId;
  in: string[];
};

export type MilestoneRule = {
  id: string;
  name: string;
  group: MilestoneGroup;
  description?: string;
  paramConditions?: ParamCondition[];
  categoryConditions?: CategoryCondition[];
};

// ==================== Creature ====================

export type Creature = {
  params: Record<ParamId, number>;
  categories: { [K in CategoryId]: CategoryValues[K] };
  phenomena: string[]; // 蓄積された現象名（時系列）
  milestones: string[]; // 発火したマイルストーン
  relations: {
    predators: string[];
    symbionts: string[];
  };
  emotionAwakening: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  alive: boolean;
  eraHistory: EraResult[];
};

// ==================== Eras ====================

export type ParamRequirement = {
  param: ParamId;
  target: number; // エラが要求する理想値 (-2..+2)
  weight: number; // ストレス計算時の重み
};

export type CategoryRequirement = {
  category: CategoryId;
  preferred: string[]; // 適合する値のリスト（その他は不適）
  weight: number;
};

export type Era = {
  index: 0 | 1 | 2 | 3 | 4 | 5;
  title: string; // 「誕生の地」など、エラの物語役割
  biomeLabel: string; // 「熱帯の砂浜」など、エラの具体名
  narrative: string; // エラの短い描写
  axes: Partial<Record<EnvironmentAxisId, AxisValue>>; // そのエラでアクティブな2軸
  requirements: ParamRequirement[];
  categoryRequirements: CategoryRequirement[];
};

export type Mutation = {
  paramId?: ParamId;
  categoryId?: CategoryId;
  delta?: number;
  newValue?: string;
  phenomenon: string;
};

export type EraResult = {
  eraIndex: number;
  stress: number;
  mutations: Mutation[];
  triggeredMilestones: string[];
  emotionStage: number;
  extinct: boolean;
  narrative?: string;
};

// ==================== Game state ====================

export type AnswerIndex = 0 | 1 | 2 | 3 | null;

export type DiagnosisPhase =
  | "intro"
  | "emotion"
  | "environment"
  | "simulating"
  | "result";

export type DiagnosisState = {
  phase: DiagnosisPhase;
  emotionAnswers: AnswerIndex[]; // length 6
  environmentAnswers: AnswerIndex[]; // length 6
};
