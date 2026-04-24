"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { MILESTONE_MAP } from "@/lib/data/milestones";
import { AWAKENING_STAGES } from "@/lib/engine/awakening";
import { generatePortrait } from "@/lib/narrative/generate";
import { useGame } from "@/store/game";

export function ResultScreen() {
  const finalCreature = useGame((s) => s.finalCreature);
  const eras = useGame((s) => s.eras);
  const reset = useGame((s) => s.reset);

  const portrait = useMemo(() => {
    if (!finalCreature || !eras) return null;
    return generatePortrait(finalCreature, eras);
  }, [finalCreature, eras]);

  if (!finalCreature || !eras || !portrait) return null;

  const awakeningLabel = AWAKENING_STAGES[finalCreature.emotionAwakening];

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-14">
        {/* --- Header / Portrait --- */}
        <motion.header
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="font-serif-jp text-xs tracking-[0.4em] text-muted">
            RESULT
          </p>
          <h1 className="font-serif-jp text-3xl leading-relaxed tracking-wide sm:text-4xl">
            {portrait.name}
          </h1>
          <p className="text-xs tracking-wider text-muted">
            {portrait.subtitle}
          </p>
        </motion.header>

        {/* --- Poetic description --- */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        >
          <p className="font-serif-jp text-base leading-loose sm:text-lg">
            {portrait.description}
          </p>
        </motion.section>

        <Divider />

        {/* --- Era timeline --- */}
        <section className="space-y-6">
          <SectionTitle>系譜</SectionTitle>
          <ol className="space-y-5">
            {finalCreature.eraHistory.map((result, idx) => {
              const era = eras[result.eraIndex];
              return (
                <motion.li
                  key={result.eraIndex}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-jp text-sm tracking-wider">
                      第{result.eraIndex + 1}期　{era.biomeLabel}
                    </span>
                    <span className="text-xs text-muted">
                      {era.title}
                      {result.extinct ? " · 絶滅" : ""}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-7 text-foreground/90">
                    {result.narrative}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </section>

        {/* --- Milestones --- */}
        {finalCreature.milestones.length > 0 && (
          <>
            <Divider />
            <section className="space-y-4">
              <SectionTitle>
                到達した特性（{finalCreature.milestones.length}）
              </SectionTitle>
              <ul className="flex flex-wrap gap-2">
                {finalCreature.milestones.map((id) => {
                  const meta = MILESTONE_MAP[id];
                  if (!meta) return null;
                  return (
                    <li
                      key={id}
                      className="border border-line px-3 py-1.5 font-serif-jp text-sm tracking-wider"
                      title={meta.group}
                    >
                      {meta.name}
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}

        {/* --- Awakening --- */}
        <Divider />
        <section className="space-y-3">
          <SectionTitle>感情の芽生え</SectionTitle>
          <div className="flex items-baseline gap-4">
            <span className="font-serif-jp text-2xl tracking-wider">
              {finalCreature.emotionAwakening}
            </span>
            <span className="text-xs text-muted">/ 9</span>
            <span className="font-serif-jp text-sm">
              {awakeningLabel}
            </span>
          </div>
          <p className="text-xs leading-6 text-muted">
            ゼロは感情なき理想の生存状態。九は「悟り」—感情が完全に芽生えた結果の絶滅。
          </p>
        </section>

        {/* --- Footer --- */}
        <div className="pt-10 text-center">
          <button
            type="button"
            onClick={reset}
            className="border border-accent px-10 py-3 font-serif-jp text-sm tracking-[0.25em] text-accent transition hover:bg-accent hover:text-background"
          >
            もう一度
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif-jp text-xs tracking-[0.3em] text-muted">
      {children}
    </h3>
  );
}

function Divider() {
  return <div className="h-px w-full bg-line" />;
}
