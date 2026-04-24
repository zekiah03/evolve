import { EMOTION_QUESTIONS } from "../data/emotionQuestions";
import { ENVIRONMENT_QUESTIONS } from "../data/environmentQuestions";
import type {
  AnswerIndex,
  AxisValue,
  EmotionAxisId,
  EmotionProfile,
  EnvironmentAxisId,
  EnvironmentProfile,
} from "../types";

const EMOTION_AXIS_IDS: readonly EmotionAxisId[] = [
  "expression",
  "speed",
  "distance",
  "direction",
  "fuel",
  "conformity",
];

const ENVIRONMENT_AXIS_IDS: readonly EnvironmentAxisId[] = [
  "temperature",
  "humidity",
  "light",
  "altitude",
  "space",
  "volatility",
];

function clampAxis(v: number): AxisValue {
  if (v <= -2) return -2;
  if (v >= 2) return 2;
  return v as AxisValue;
}

export function computeEmotionProfile(
  answers: readonly AnswerIndex[],
): EmotionProfile {
  const profile = Object.fromEntries(
    EMOTION_AXIS_IDS.map((id) => [id, 0]),
  ) as Record<EmotionAxisId, number>;

  EMOTION_QUESTIONS.forEach((q, i) => {
    const answerIndex = answers[i];
    if (answerIndex == null) return;
    const choice = q.choices[answerIndex];
    for (const eff of choice.effects) {
      profile[eff.axis] += eff.delta;
    }
  });

  return Object.fromEntries(
    EMOTION_AXIS_IDS.map((id) => [id, clampAxis(profile[id])]),
  ) as EmotionProfile;
}

export function computeEnvironmentProfile(
  answers: readonly AnswerIndex[],
): EnvironmentProfile {
  const profile = Object.fromEntries(
    ENVIRONMENT_AXIS_IDS.map((id) => [id, 0]),
  ) as Record<EnvironmentAxisId, number>;

  ENVIRONMENT_QUESTIONS.forEach((q, i) => {
    const answerIndex = answers[i];
    if (answerIndex == null) return;
    const choice = q.choices[answerIndex];
    for (const eff of choice.effects) {
      profile[eff.axis] += eff.delta;
    }
  });

  return Object.fromEntries(
    ENVIRONMENT_AXIS_IDS.map((id) => [id, clampAxis(profile[id])]),
  ) as EnvironmentProfile;
}
