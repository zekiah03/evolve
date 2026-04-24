import type { EmotionQuestion } from "../types";

// 各選択は4択で、2つの感情軸を同時に測る（2×2マトリクス）。
// 正符号の極: 発散 / 即応 / 共感 / 攻撃 / 駆動 / 同化
// 負符号の極: 内包 / 熟慮 / 独立 / 防御 / 回避 / 独自

export const EMOTION_QUESTIONS: readonly EmotionQuestion[] = [
  {
    id: "Q1",
    index: 1,
    category: "日常",
    prompt:
      "朝、通勤電車で隣の人が大きな音で音楽を漏らしている。最初に浮かぶ反応は？",
    choices: [
      {
        label: "A",
        text: "舌打ちか咳払いで、そっと存在を知らせる",
        effects: [
          { axis: "expression", delta: 1 },
          { axis: "speed", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "無言で席を立ち、別の車両へ移る",
        effects: [
          { axis: "expression", delta: -1 },
          { axis: "speed", delta: 1 },
        ],
      },
      {
        label: "C",
        text: "相手の事情を想像して、降りるまで待つ",
        effects: [
          { axis: "expression", delta: -1 },
          { axis: "speed", delta: -1 },
        ],
      },
      {
        label: "D",
        text: "SNSにこの出来事を書く文面を頭の中で練る",
        effects: [
          { axis: "expression", delta: 1 },
          { axis: "speed", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "Q2",
    index: 2,
    category: "対人",
    prompt: "会議で自分の提案を、同僚にはっきり否定された。次の一手は？",
    choices: [
      {
        label: "A",
        text: "相手の論点を認めた上で、根拠を補強して再提案する",
        effects: [
          { axis: "distance", delta: 1 },
          { axis: "direction", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "相手の表情を見て、今日はこれ以上は言わないでおく",
        effects: [
          { axis: "distance", delta: 1 },
          { axis: "direction", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "感情は切り離し、データだけで押し返す",
        effects: [
          { axis: "distance", delta: -1 },
          { axis: "direction", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "もう議論せず、自分の担当範囲を黙々と進める",
        effects: [
          { axis: "distance", delta: -1 },
          { axis: "direction", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "Q3",
    index: 3,
    category: "集団",
    prompt:
      "所属している集団で、新しい挑戦が始まった。全員の期待が高まっている。あなたは？",
    choices: [
      {
        label: "A",
        text: "空気に乗せられて、先頭を切って動き出す",
        effects: [
          { axis: "fuel", delta: 1 },
          { axis: "conformity", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "誰もやらない役割を見つけて、そこで力を出す",
        effects: [
          { axis: "fuel", delta: 1 },
          { axis: "conformity", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "全体のテンションに合わせて、無理のない範囲で参加する",
        effects: [
          { axis: "fuel", delta: -1 },
          { axis: "conformity", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "周りの熱量とは別に、自分のペースを崩さない",
        effects: [
          { axis: "fuel", delta: -1 },
          { axis: "conformity", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "Q4",
    index: 4,
    category: "親密",
    prompt:
      "親しい人に、自分のことを少し誤解されていると気づいた。どうする？",
    choices: [
      {
        label: "A",
        text: "その場で感情を見せて、本音でぶつかる",
        effects: [
          { axis: "expression", delta: 1 },
          { axis: "distance", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "「違う」とだけ置いて、相手の反応は求めない",
        effects: [
          { axis: "expression", delta: 1 },
          { axis: "distance", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "何も言わず、相手の見方にも一理あると受け止める",
        effects: [
          { axis: "expression", delta: -1 },
          { axis: "distance", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "何も言わず、その人との距離を静かに取り直す",
        effects: [
          { axis: "expression", delta: -1 },
          { axis: "distance", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "Q5",
    index: 5,
    category: "緊急",
    prompt: "深夜、予定になかった緊急の連絡が入る。あなたは？",
    choices: [
      {
        label: "A",
        text: "すぐ起き上がり、身体にエンジンがかかる",
        effects: [
          { axis: "speed", delta: 1 },
          { axis: "fuel", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "短く返信だけして、判断は明日に回す",
        effects: [
          { axis: "speed", delta: 1 },
          { axis: "fuel", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "状況を一度整理してから、腰を据えて動き出す",
        effects: [
          { axis: "speed", delta: -1 },
          { axis: "fuel", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "今夜の自分の判断は信じない。朝まで寝かせる",
        effects: [
          { axis: "speed", delta: -1 },
          { axis: "fuel", delta: -1 },
        ],
      },
    ],
  },
  {
    id: "Q6",
    index: 6,
    category: "人生",
    prompt:
      "大切にしてきたものを、どうしても手放さなければいけない岐路に立った。最後に選ぶのは？",
    choices: [
      {
        label: "A",
        text: "仲間と同じ方向に歩き出し、その喪失を力に変える",
        effects: [
          { axis: "direction", delta: 1 },
          { axis: "conformity", delta: 1 },
        ],
      },
      {
        label: "B",
        text: "誰も選ばない道に踏み出して、意味を自分で作り直す",
        effects: [
          { axis: "direction", delta: 1 },
          { axis: "conformity", delta: -1 },
        ],
      },
      {
        label: "C",
        text: "周りと同じ程度には傷つく場所に、身を置いておく",
        effects: [
          { axis: "direction", delta: -1 },
          { axis: "conformity", delta: 1 },
        ],
      },
      {
        label: "D",
        text: "誰にも踏み込ませない場所に、それを静かに持っていく",
        effects: [
          { axis: "direction", delta: -1 },
          { axis: "conformity", delta: -1 },
        ],
      },
    ],
  },
] as const;
