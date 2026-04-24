"use client";

import { useEffect } from "react";
import { IntroScreen } from "./IntroScreen";
import { QuestionCard } from "./QuestionCard";
import { ResultScreen } from "./ResultScreen";
import {
  CLOSING_MS,
  ERA_DURATION_MS,
  OPENING_MS,
  SimulatingScreen,
} from "./SimulatingScreen";
import { useGame } from "@/store/game";

export function DiagnosisFlow() {
  const phase = useGame((s) => s.phase);
  const finishSimulating = useGame((s) => s.finishSimulating);
  const eraCount = useGame((s) => s.finalCreature?.eraHistory.length ?? 0);

  useEffect(() => {
    if (phase !== "simulating") return;
    const dwell = OPENING_MS + eraCount * ERA_DURATION_MS + CLOSING_MS;
    const t = window.setTimeout(finishSimulating, dwell);
    return () => window.clearTimeout(t);
  }, [phase, eraCount, finishSimulating]);

  switch (phase) {
    case "intro":
      return <IntroScreen />;
    case "emotion":
    case "environment":
      return <QuestionCard />;
    case "simulating":
      return <SimulatingScreen />;
    case "result":
      return <ResultScreen />;
  }
}
