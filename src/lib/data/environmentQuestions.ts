import type { EnvironmentQuestion } from "../types";

// 正符号の極: 温暖 / 湿潤 / 明 / 高 / 開放 / 激変
// 負符号の極: 寒冷 / 乾燥 / 暗 / 低 / 閉鎖 / 安定

export const ENVIRONMENT_QUESTIONS: readonly EnvironmentQuestion[] = [
  {
    id: "E1",
    index: 1,
    category: "誕生の地",
    prompt: "一週間だけ、心から休める場所を一つ選べるなら？",
    choices: [
      {
        label: "A",
        text: "白い砂浜、温かい潮風、夜も半袖のままでいられる",
        effects: [
          { axis: "temperature", delta: 1 },
          { axis: "humidity", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "オリーブ畑の石壁の家、乾いた昼の光と涼しい夜",
        effects: [
          { axis: "temperature", delta: 1 },
          { axis: "humidity", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "雪の針葉樹林、青い薄明かりと厚い毛布",
        effects: [
          { axis: "temperature", delta: -1 },
          { axis: "humidity", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "空気の澄んだ高原、岩肌と遠くまで見通す乾いた風",
        effects: [
          { axis: "temperature", delta: -1 },
          { axis: "humidity", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "E2",
    index: 2,
    category: "立体ニッチ",
    prompt: "ひとりで深く考え込みたくなった時、自然と足が向くのは？",
    choices: [
      {
        label: "A",
        text: "陽射しの届く屋上、風に髪を撫でられる高い場所",
        effects: [
          { axis: "light", delta: 1 },
          { axis: "altitude", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "日当たりのいい窓辺、床に腰を下ろせる低い場所",
        effects: [
          { axis: "light", delta: 1 },
          { axis: "altitude", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "星明かりだけの展望台、夜の街を見下ろす高層",
        effects: [
          { axis: "light", delta: -1 },
          { axis: "altitude", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "低い天井の書斎、小さな灯りと本の匂い",
        effects: [
          { axis: "light", delta: -1 },
          { axis: "altitude", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "E3",
    index: 3,
    category: "日常の質感",
    prompt: "毎日の暮らしの舞台を選べるなら、長い年月を過ごしたいのは？",
    choices: [
      {
        label: "A",
        text: "地平線まで見える町、風が抜けて季節がゆっくり巡る",
        effects: [
          { axis: "space", delta: 1 },
          { axis: "volatility", delta: -1 },
        ],
      },
      {
        label: "B",
        text: "広い原野、時々嵐や火が走り抜ける土地",
        effects: [
          { axis: "space", delta: 1 },
          { axis: "volatility", delta: 1 },
        ],
      },
      {
        label: "C",
        text: "石畳の路地裏、時間が止まったような小さな家",
        effects: [
          { axis: "space", delta: -1 },
          { axis: "volatility", delta: -1 },
        ],
      },
      {
        label: "D",
        text: "人と物が密集した下町、毎日誰かの騒ぎが聞こえる",
        effects: [
          { axis: "space", delta: -1 },
          { axis: "volatility", delta: 1 },
        ],
      },
    ],
  },
  {
    id: "E4",
    index: 4,
    category: "第一の転機",
    prompt: "「生きている」と深く感じる瞬間。その背景にある気候と光は？",
    choices: [
      {
        label: "A",
        text: "真夏の真昼、白く燃える陽射しと蝉の声",
        effects: [
          { axis: "temperature", delta: 1 },
          { axis: "light", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "熱帯夜、湿った闇と遠い雷",
        effects: [
          { axis: "temperature", delta: 1 },
          { axis: "light", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "雪晴れの朝、眩しい銀世界と澄んだ空",
        effects: [
          { axis: "temperature", delta: -1 },
          { axis: "light", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "極夜の静けさ、オーロラと自分の呼吸の音",
        effects: [
          { axis: "temperature", delta: -1 },
          { axis: "light", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "E5",
    index: 5,
    category: "領域の拡張",
    prompt: "長い旅を一人で続けるとしたら、歩き続けたい土地は？",
    choices: [
      {
        label: "A",
        text: "霧の立ち込める湿原、見渡す限りの葦と水面",
        effects: [
          { axis: "humidity", delta: 1 },
          { axis: "space", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "苔むした深い森、どこまでも続く緑の天井",
        effects: [
          { axis: "humidity", delta: 1 },
          { axis: "space", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "地平線まで続く赤い砂漠、影ひとつない広がり",
        effects: [
          { axis: "humidity", delta: -1 },
          { axis: "space", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "迷路のような岩山の谷、乾いた風が石を削る",
        effects: [
          { axis: "humidity", delta: -1 },
          { axis: "space", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "E6",
    index: 6,
    category: "終局",
    prompt: "もしたどり着く最後の場所を自分で選べるなら、それはどこ？",
    choices: [
      {
        label: "A",
        text: "雲の上の高原、風もなく、すべてが遠い",
        effects: [
          { axis: "altitude", delta: 1 },
          { axis: "volatility", delta: -1 },
        ],
      },
      {
        label: "B",
        text: "嵐の山頂、雷雲の上で稲妻と並ぶ",
        effects: [
          { axis: "altitude", delta: 1 },
          { axis: "volatility", delta: 1 },
        ],
      },
      {
        label: "C",
        text: "深海の底、静かな闇と変わらない水温",
        effects: [
          { axis: "altitude", delta: -1 },
          { axis: "volatility", delta: -1 },
        ],
      },
      {
        label: "D",
        text: "火山の地下、熱水と振動に満ちた裂け目",
        effects: [
          { axis: "altitude", delta: -1 },
          { axis: "volatility", delta: 1 },
        ],
      },
    ],
  },
] as const;
