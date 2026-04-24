"use client";

import { useEffect } from "react";
import { IntroScreen } from "./IntroScreen";
import { QuestionCard } from "./QuestionCard";
import { ResultScreen } from "./ResultScreen";
import { SimulatingScreen } from "./SimulatingScreen";
import { useGame } from "@/store/game";

// シミュレーション演出の最低表示時間（ms）。
// simulate() は同期で完了するので、見せ場として少し滞留させる。
const SIMULATION_DWELL_MS = 2400;

export function DiagnosisFlow() {
  const phase = useGame((s) => s.phase);
  const finishSimulating = useGame((s) => s.finishSimulating);

  useEffect(() => {
    if (phase !== "simulating") return;
    const t = window.setTimeout(finishSimulating, SIMULATION_DWELL_MS);
    return () => window.clearTimeout(t);
  }, [phase, finishSimulating]);

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
