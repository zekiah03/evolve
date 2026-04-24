"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  selectCanProceed,
  selectCurrentAnswer,
  selectCurrentQuestion,
  selectProgress,
  useGame,
} from "@/store/game";

const CHOICE_LABELS = ["A", "B", "C", "D"] as const;

export function QuestionCard() {
  const question = useGame(selectCurrentQuestion);
  const answer = useGame(selectCurrentAnswer);
  const canProceed = useGame(selectCanProceed);
  // selectProgress は { done, total } を返すので、参照比較だと毎回別オブジェクトに
  // なりリレンダー無限ループを起こす。useShallow で内容比較に切り替える。
  const { done, total } = useGame(useShallow(selectProgress));
  const phase = useGame((s) => s.phase);
  const questionIndex = useGame((s) => s.questionIndex);
  const answerAction = useGame((s) => s.answer);
  const nextAction = useGame((s) => s.next);

  // 質問が切り替わったら画面先頭へ（モバイルで選択肢が長い場合に備えて）
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [phase, questionIndex]);

  if (!question) return null;

  const phaseLabel = phase === "emotion" ? "感情" : "風景";
  const sectionKey = `${phase}-${questionIndex}`;
  const currentNumber = done + 1;
  const promptId = `prompt-${sectionKey}`;

  return (
    <main className="flex flex-1 flex-col items-center justify-between px-5 py-10 sm:px-6 sm:py-12">
      <Header
        done={currentNumber}
        total={total}
        phaseLabel={phaseLabel}
      />

      <AnimatePresence mode="wait">
        <motion.section
          key={sectionKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-xl flex-1 flex flex-col justify-center py-6 sm:py-8"
          aria-labelledby={promptId}
        >
          <p className="text-center font-serif-jp text-xs tracking-[0.3em] text-muted">
            Q{questionIndex + 1}
            {question.category ? ` — ${question.category}` : ""}
          </p>
          <h2
            id={promptId}
            className="mt-5 text-center font-serif-jp text-[1.35rem] leading-[1.8] sm:text-2xl sm:mt-6"
          >
            {question.prompt}
          </h2>

          <ul
            role="radiogroup"
            aria-labelledby={promptId}
            className="mt-8 space-y-3 sm:mt-10"
          >
            {question.choices.map((choice, idx) => {
              const selected = answer === idx;
              return (
                <li key={choice.label}>
                  <ChoiceButton
                    label={CHOICE_LABELS[idx]}
                    text={choice.text}
                    selected={selected}
                    onSelect={() => answerAction(idx as 0 | 1 | 2 | 3)}
                  />
                </li>
              );
            })}
          </ul>
        </motion.section>
      </AnimatePresence>

      <Footer
        canProceed={canProceed}
        onNext={nextAction}
        isLast={currentNumber === total}
      />
    </main>
  );
}

function Header({
  done,
  total,
  phaseLabel,
}: {
  done: number;
  total: number;
  phaseLabel: string;
}) {
  const pct = Math.round((done / total) * 100);
  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center justify-between text-xs tracking-widest text-muted">
        <span className="font-serif-jp">{phaseLabel}の問い</span>
        <span aria-hidden="true">
          {done} / {total}
        </span>
      </div>
      <div
        className="mt-2 h-[2px] w-full bg-line overflow-hidden"
        role="progressbar"
        aria-label="診断の進捗"
        aria-valuenow={done}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuetext={`全${total}問中${done}問目`}
      >
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function ChoiceButton({
  label,
  text,
  selected,
  onSelect,
}: {
  label: string;
  text: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`w-full min-h-[3.5rem] text-left border px-4 py-4 transition sm:px-5 ${
        selected
          ? "border-accent bg-accent text-background"
          : "border-line hover:border-accent active:border-accent"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={`font-serif-jp text-sm tracking-widest ${
            selected ? "text-background" : "text-muted"
          }`}
        >
          {label}
        </span>
        <span className="text-[0.95rem] leading-[1.7] sm:text-base">{text}</span>
      </div>
    </button>
  );
}

function Footer({
  canProceed,
  onNext,
  isLast,
}: {
  canProceed: boolean;
  onNext: () => void;
  isLast: boolean;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  // 回答が入ったら「次へ」にヒントとしてフォーカスを移すと、
  // キーボードユーザーがそのまま Enter で進める。
  useEffect(() => {
    if (canProceed && btnRef.current) btnRef.current.focus();
  }, [canProceed]);

  return (
    <div className="w-full max-w-xl pt-6 flex justify-end">
      <button
        ref={btnRef}
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className="min-h-[3rem] border border-accent px-8 py-2.5 font-serif-jp text-sm tracking-[0.2em] text-accent transition hover:bg-accent hover:text-background active:bg-accent active:text-background disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        {isLast ? "結果を見る" : "次へ"}
      </button>
    </div>
  );
}
