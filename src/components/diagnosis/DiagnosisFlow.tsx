"use client";

import { MotionConfig } from "framer-motion";
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

type Props = {
  /** サーバーサイドで検証済みの共有コード。あれば結果を復元する。 */
  sharedCode?: string | null;
};

export function DiagnosisFlow({ sharedCode }: Props) {
  const phase = useGame((s) => s.phase);
  const finishSimulating = useGame((s) => s.finishSimulating);
  const loadFromShareCode = useGame((s) => s.loadFromShareCode);
  const eraCount = useGame((s) => s.finalCreature?.eraHistory.length ?? 0);

  // 共有コード経由で来た場合、loadFromShareCode が呼ばれて phase が
  // "result" に飛ぶまでの一瞬だけローダーを見せる。phase が result
  // 以外の時、かつ sharedCode が指定されている時のみ true になる。
  const showingShareLoader = sharedCode != null && phase !== "result";

  useEffect(() => {
    if (sharedCode) {
      loadFromShareCode(sharedCode);
    }
  }, [sharedCode, loadFromShareCode]);

  useEffect(() => {
    if (phase !== "simulating") return;
    const dwell = OPENING_MS + eraCount * ERA_DURATION_MS + CLOSING_MS;
    const t = window.setTimeout(finishSimulating, dwell);
    return () => window.clearTimeout(t);
  }, [phase, eraCount, finishSimulating]);

  return (
    <MotionConfig reducedMotion="user">
      {showingShareLoader ? <ShareLoading /> : renderPhase(phase)}
    </MotionConfig>
  );
}

function ShareLoading() {
  return (
    <main
      className="flex flex-1 items-center justify-center px-6"
      aria-busy="true"
      aria-label="共有された診断結果を読み込み中"
    />
  );
}

function renderPhase(phase: ReturnType<typeof useGame.getState>["phase"]) {
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
