"use client";

import { AnimatePresence, motion } from "framer-motion";
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
  const { done, total } = useGame(selectProgress);
  const phase = useGame((s) => s.phase);
  const questionIndex = useGame((s) => s.questionIndex);
  const answerAction = useGame((s) => s.answer);
  const nextAction = useGame((s) => s.next);

  if (!question) return null;

  const phaseLabel = phase === "emotion" ? "感情" : "風景";
  const sectionKey = `${phase}-${questionIndex}`;

  return (
    <main className="flex flex-1 flex-col items-center justify-between px-6 py-12">
      <Header done={done} total={total} phaseLabel={phaseLabel} />

      <AnimatePresence mode="wait">
        <motion.div
          key={sectionKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-xl flex-1 flex flex-col justify-center py-8"
        >
          <p className="text-center font-serif-jp text-xs tracking-[0.3em] text-muted">
            Q{questionIndex + 1}{question.category ? ` — ${question.category}` : ""}
          </p>
          <h2 className="mt-6 text-center font-serif-jp text-xl leading-relaxed sm:text-2xl">
            {question.prompt}
          </h2>

          <ul className="mt-10 space-y-3">
            {question.choices.map((choice, idx) => {
              const selected = answer === idx;
              return (
                <li key={choice.label}>
                  <button
                    type="button"
                    onClick={() => answerAction(idx as 0 | 1 | 2 | 3)}
                    className={`group w-full text-left border px-5 py-4 transition ${
                      selected
                        ? "border-accent bg-accent text-background"
                        : "border-line hover:border-accent"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-serif-jp text-sm tracking-widest ${
                          selected ? "text-background" : "text-muted"
                        }`}
                      >
                        {CHOICE_LABELS[idx]}
                      </span>
                      <span className="leading-7 text-sm sm:text-base">
                        {choice.text}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </AnimatePresence>

      <Footer canProceed={canProceed} onNext={nextAction} />
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
  const pct = Math.round(((done + 1) / total) * 100);
  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center justify-between text-xs tracking-widest text-muted">
        <span className="font-serif-jp">{phaseLabel}の問い</span>
        <span>
          {done + 1} / {total}
        </span>
      </div>
      <div className="mt-2 h-px w-full bg-line">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Footer({
  canProceed,
  onNext,
}: {
  canProceed: boolean;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-xl pt-6 flex justify-end">
      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className="border border-accent px-8 py-2.5 font-serif-jp text-sm tracking-[0.2em] text-accent transition hover:bg-accent hover:text-background disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        次へ
      </button>
    </div>
  );
}
