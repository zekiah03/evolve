import { create } from "zustand";
import { EMOTION_QUESTIONS } from "@/lib/data/emotionQuestions";
import { ENVIRONMENT_QUESTIONS } from "@/lib/data/environmentQuestions";
import { emotionToCreature } from "@/lib/engine/emotionToCreature";
import { environmentToEras } from "@/lib/engine/environmentToEras";
import {
  computeEmotionProfile,
  computeEnvironmentProfile,
} from "@/lib/engine/profile";
import { simulateAll } from "@/lib/engine/simulator";
import type {
  AnswerIndex,
  Creature,
  DiagnosisPhase,
  EmotionProfile,
  EnvironmentProfile,
  Era,
} from "@/lib/types";

type GameState = {
  phase: DiagnosisPhase;
  /** Index within the current phase (0..5) */
  questionIndex: number;
  emotionAnswers: AnswerIndex[];
  environmentAnswers: AnswerIndex[];

  // Computed results (populated after simulation)
  emotionProfile: EmotionProfile | null;
  environmentProfile: EnvironmentProfile | null;
  initialCreature: Creature | null;
  eras: Era[] | null;
  finalCreature: Creature | null;

  // --- Actions ---
  start: () => void;
  answer: (choice: 0 | 1 | 2 | 3) => void;
  next: () => void;
  simulate: () => void;
  reset: () => void;
};

const emptyAnswers = (): AnswerIndex[] =>
  [null, null, null, null, null, null];

const INITIAL: Omit<
  GameState,
  "start" | "answer" | "next" | "simulate" | "reset"
> = {
  phase: "intro",
  questionIndex: 0,
  emotionAnswers: emptyAnswers(),
  environmentAnswers: emptyAnswers(),
  emotionProfile: null,
  environmentProfile: null,
  initialCreature: null,
  eras: null,
  finalCreature: null,
};

export const useGame = create<GameState>((set, get) => ({
  ...INITIAL,

  start: () => {
    set({
      ...INITIAL,
      phase: "emotion",
    });
  },

  answer: (choice) => {
    const { phase, questionIndex, emotionAnswers, environmentAnswers } = get();
    if (phase === "emotion") {
      const next = [...emotionAnswers];
      next[questionIndex] = choice;
      set({ emotionAnswers: next });
    } else if (phase === "environment") {
      const next = [...environmentAnswers];
      next[questionIndex] = choice;
      set({ environmentAnswers: next });
    }
  },

  next: () => {
    const { phase, questionIndex } = get();
    if (phase === "emotion") {
      if (questionIndex < EMOTION_QUESTIONS.length - 1) {
        set({ questionIndex: questionIndex + 1 });
      } else {
        set({ phase: "environment", questionIndex: 0 });
      }
      return;
    }
    if (phase === "environment") {
      if (questionIndex < ENVIRONMENT_QUESTIONS.length - 1) {
        set({ questionIndex: questionIndex + 1 });
      } else {
        get().simulate();
      }
    }
  },

  simulate: () => {
    const { emotionAnswers, environmentAnswers } = get();
    set({ phase: "simulating" });

    const emotionProfile = computeEmotionProfile(emotionAnswers);
    const environmentProfile = computeEnvironmentProfile(environmentAnswers);
    const initialCreature = emotionToCreature(emotionProfile);
    const eras = environmentToEras(environmentAnswers);
    const finalCreature = simulateAll(initialCreature, eras);

    set({
      phase: "result",
      emotionProfile,
      environmentProfile,
      initialCreature,
      eras,
      finalCreature,
    });
  },

  reset: () => {
    set({ ...INITIAL });
  },
}));

// ==================== Selectors ====================
// Convenience derivations. Consumers should prefer these to avoid
// re-selecting whole slices unnecessarily.

export function selectCurrentQuestion(state: GameState) {
  if (state.phase === "emotion") return EMOTION_QUESTIONS[state.questionIndex];
  if (state.phase === "environment")
    return ENVIRONMENT_QUESTIONS[state.questionIndex];
  return null;
}

export function selectCurrentAnswer(state: GameState): AnswerIndex {
  if (state.phase === "emotion")
    return state.emotionAnswers[state.questionIndex] ?? null;
  if (state.phase === "environment")
    return state.environmentAnswers[state.questionIndex] ?? null;
  return null;
}

export function selectProgress(state: GameState): { done: number; total: number } {
  const total = EMOTION_QUESTIONS.length + ENVIRONMENT_QUESTIONS.length;
  if (state.phase === "emotion") {
    return { done: state.questionIndex, total };
  }
  if (state.phase === "environment") {
    return {
      done: EMOTION_QUESTIONS.length + state.questionIndex,
      total,
    };
  }
  if (state.phase === "simulating" || state.phase === "result") {
    return { done: total, total };
  }
  return { done: 0, total };
}

export function selectCanProceed(state: GameState): boolean {
  const ans = selectCurrentAnswer(state);
  return ans != null;
}
