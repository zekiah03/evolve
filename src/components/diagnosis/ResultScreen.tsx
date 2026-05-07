"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { MILESTONE_MAP } from "@/lib/data/milestones";
import { AWAKENING_STAGES } from "@/lib/engine/awakening";
import {
  AWAKENING_INFLUENCE_LABEL,
  eraDrivers,
  explainAwakening,
  topEmotionAxes,
  topTraits,
} from "@/lib/narrative/explainEvolution";
import { generatePortrait } from "@/lib/narrative/generate";
import { findClosestSpecies } from "@/lib/narrative/matchSpecies";
import { buildShareUrl, encodeAnswers } from "@/lib/share";
import { useGame } from "@/store/game";

export function ResultScreen() {
  const finalCreature = useGame((s) => s.finalCreature);
  const eras = useGame((s) => s.eras);
  const emotionProfile = useGame((s) => s.emotionProfile);
  const emotionAnswers = useGame((s) => s.emotionAnswers);
  const environmentAnswers = useGame((s) => s.environmentAnswers);
  const reset = useGame((s) => s.reset);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const portrait = useMemo(() => {
    if (!finalCreature || !eras) return null;
    return generatePortrait(finalCreature, eras);
  }, [finalCreature, eras]);

  const cousins = useMemo(() => {
    if (!finalCreature) return [];
    return findClosestSpecies(finalCreature, 3);
  }, [finalCreature]);

  const logic = useMemo(() => {
    if (!finalCreature || !eras || !emotionProfile) return null;
    return {
      axes: topEmotionAxes(emotionProfile, 3),
      traits: topTraits(finalCreature, 6),
      drivers: eraDrivers(eras, finalCreature),
      awakening: explainAwakening(finalCreature),
    };
  }, [finalCreature, eras, emotionProfile]);

  const shareUrl = useMemo(() => {
    const code = encodeAnswers(emotionAnswers, environmentAnswers);
    if (!code) return null;
    return buildShareUrl(code);
  }, [emotionAnswers, environmentAnswers]);

  // 結果画面に入ったら、スクリーンリーダーが種名を読み上げるために
  // 見出しへフォーカスを移す。ユーザーのスクロール位置もトップへ。
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    headingRef.current?.focus();
  }, []);

  if (!finalCreature || !eras || !portrait) return null;

  const awakeningLabel = AWAKENING_STAGES[finalCreature.emotionAwakening];

  return (
    <main
      className="flex flex-1 flex-col items-center px-5 py-12 sm:px-6 sm:py-16"
      aria-labelledby="result-name"
    >
      <div className="w-full max-w-2xl space-y-12 sm:space-y-14">
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
          <h1
            ref={headingRef}
            id="result-name"
            tabIndex={-1}
            className="font-serif-jp text-[1.75rem] leading-relaxed tracking-wide outline-none sm:text-4xl"
          >
            {portrait.name}
          </h1>
          <p className="text-xs tracking-wider text-muted">
            {portrait.subtitle}
          </p>
        </motion.header>

        {/* --- Poetic description --- */}
        <motion.section
          aria-label="肖像"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        >
          <p className="font-serif-jp text-base leading-[2] sm:text-lg">
            {portrait.description}
          </p>
        </motion.section>

        {logic && (
          <>
            <Divider />
            <section
              aria-labelledby="title-logic"
              className="space-y-7"
            >
              <SectionTitle id="title-logic">進化の論理</SectionTitle>

              {/* 1. 核となった感情 */}
              <div className="space-y-3">
                <h3 className="font-serif-jp text-sm tracking-wider text-foreground/80">
                  核となった感情
                </h3>
                <ul className="space-y-1.5">
                  {logic.axes.map((a) => (
                    <li
                      key={a.axisId}
                      className="flex items-baseline gap-3 text-sm sm:text-base"
                    >
                      <span className="font-serif-jp text-muted text-xs">
                        {a.label}
                      </span>
                      <span className="font-serif-jp">{a.pole}</span>
                      <span className="text-xs text-muted">
                        ×{a.magnitude}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. 環境が要求したもの（エラ別の主因） */}
              <div className="space-y-3">
                <h3 className="font-serif-jp text-sm tracking-wider text-foreground/80">
                  環境が要求したもの
                </h3>
                <ul className="space-y-1.5">
                  {logic.drivers.map((d) => (
                    <li
                      key={d.eraIndex}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm sm:text-base"
                    >
                      <span className="font-serif-jp">{d.biome}</span>
                      <span className="text-muted text-xs">
                        ({d.drivingAxes})
                      </span>
                      <span className="text-muted text-xs">→</span>
                      <span className="font-serif-jp">
                        {d.primaryEffect ?? "馴染んだ"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. 体に残った印 */}
              <div className="space-y-3">
                <h3 className="font-serif-jp text-sm tracking-wider text-foreground/80">
                  体に残った印
                </h3>
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm sm:text-base">
                  {logic.traits.map((t) => (
                    <li
                      key={t.paramId}
                      className="font-serif-jp"
                    >
                      {t.label}{" "}
                      <span className="text-muted text-xs">
                        {t.value > 0 ? `+${t.value}` : t.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. 感情覚醒の力学（dominant influence） */}
              <p className="font-serif-jp text-sm italic text-muted leading-7">
                — {AWAKENING_INFLUENCE_LABEL[logic.awakening.dominantInfluence]} —
              </p>
            </section>
          </>
        )}

        <Divider />

        {/* --- Era timeline --- */}
        <section aria-labelledby="title-timeline" className="space-y-6">
          <SectionTitle id="title-timeline">系譜</SectionTitle>
          <ol className="relative space-y-8 pl-7 sm:pl-8">
            {/* 縦に通った進化の軸 */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[10px] top-2 bottom-2 w-px bg-line sm:left-3"
            />
            {finalCreature.eraHistory.map((result, idx) => {
              const era = eras[result.eraIndex];
              const previousStage =
                idx === 0
                  ? 0
                  : finalCreature.eraHistory[idx - 1].emotionStage;
              const awakeningEvent =
                result.emotionStage > previousStage
                  ? AWAKENING_STAGES[result.emotionStage]
                  : null;
              return (
                <motion.li
                  key={result.eraIndex}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                  className="relative"
                >
                  {/* ノード（節点） */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-7 top-2 inline-block h-[10px] w-[10px] rounded-full border border-accent sm:-left-8 sm:top-2.5 ${
                      result.extinct
                        ? "bg-background"
                        : result.mutations.length > 0
                          ? "bg-accent"
                          : "bg-background"
                    }`}
                  />

                  {/* エラ見出し */}
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif-jp text-[0.7rem] tracking-[0.3em] text-muted">
                      第{result.eraIndex + 1}期 ・ {era.title}
                    </p>
                    {result.extinct && (
                      <span className="font-serif-jp text-[0.65rem] tracking-[0.4em] text-muted">
                        絶滅
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 font-serif-jp text-lg leading-relaxed sm:text-xl">
                    {era.biomeLabel}
                  </h3>

                  {/* 環境 → 変化（変異） */}
                  {result.mutations.length > 0 ? (
                    <ul className="mt-3 space-y-1.5">
                      {result.mutations.map((m, i) => (
                        <li
                          key={`${result.eraIndex}-mut-${i}`}
                          className="flex items-baseline gap-2.5"
                        >
                          <span
                            aria-hidden="true"
                            className="text-muted text-xs"
                          >
                            →
                          </span>
                          <span className="font-serif-jp text-[0.95rem] sm:text-base">
                            {m.phenomenon}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted">
                      この時代には何も起きなかった。
                    </p>
                  )}

                  {/* 解禁されたマイルストーン */}
                  {result.triggeredMilestones.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {result.triggeredMilestones.map((name) => (
                        <li
                          key={`${result.eraIndex}-ms-${name}`}
                          className="flex items-baseline gap-2.5"
                        >
                          <span
                            aria-hidden="true"
                            className="text-accent text-xs"
                          >
                            ★
                          </span>
                          <span className="font-serif-jp text-[0.95rem] sm:text-base">
                            {name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* 感情の芽生え */}
                  {awakeningEvent && (
                    <p className="mt-3 font-serif-jp text-xs italic text-muted">
                      — {awakeningEvent} が兆した —
                    </p>
                  )}
                </motion.li>
              );
            })}
          </ol>
        </section>

        {/* --- Earth cousins --- */}
        {cousins.length > 0 && (
          <>
            <Divider />
            <section aria-labelledby="title-cousins" className="space-y-4">
              <SectionTitle id="title-cousins">地球の兄弟</SectionTitle>
              <p className="font-serif-jp text-sm leading-8 text-foreground/90 sm:text-base">
                その肖像に最も近いのは、
              </p>
              <ul className="space-y-2">
                {cousins.map((sp) => (
                  <motion.li
                    key={sp.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                  >
                    <span className="font-serif-jp text-base sm:text-lg">
                      {sp.name}
                    </span>
                    <span className="text-xs text-muted">— {sp.epithet}</span>
                    <span className="text-[0.65rem] tracking-widest text-muted/70">
                      {sp.group}
                    </span>
                  </motion.li>
                ))}
              </ul>
              <p className="font-serif-jp text-sm leading-8 text-foreground/90 sm:text-base">
                の三体である。
              </p>
            </section>
          </>
        )}

        {/* --- Milestones --- */}
        {finalCreature.milestones.length > 0 && (
          <>
            <Divider />
            <section aria-labelledby="title-milestones" className="space-y-4">
              <SectionTitle id="title-milestones">
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
                    >
                      <span className="sr-only">{meta.group}の特性：</span>
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
        <section aria-labelledby="title-awakening" className="space-y-3">
          <SectionTitle id="title-awakening">感情の芽生え</SectionTitle>
          <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-serif-jp text-2xl tracking-wider">
              {finalCreature.emotionAwakening}
            </span>
            <span className="text-xs text-muted">/ 9</span>
            <span className="font-serif-jp text-sm sm:text-base">
              {awakeningLabel}
            </span>
          </p>
          <p className="text-xs leading-6 text-muted">
            ゼロは感情なき理想の生存状態。九は「悟り」—感情が完全に芽生えた結果の絶滅。
          </p>
        </section>

        {/* --- Footer --- */}
        <div className="pt-8 flex flex-col items-center gap-4 sm:pt-10 sm:flex-row sm:justify-center">
          {shareUrl && <ShareButton url={shareUrl} />}
          <button
            type="button"
            onClick={reset}
            className="min-h-[3rem] border border-accent px-10 py-3 font-serif-jp text-sm tracking-[0.25em] text-accent transition hover:bg-accent hover:text-background active:bg-accent active:text-background"
          >
            もう一度
          </button>
        </div>
      </div>
    </main>
  );
}

function ShareButton({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const handleClick = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setState("copied");
      } else {
        // 非対応環境は URL を prompt で表示するフォールバック
        window.prompt("このURLを共有できます", url);
        setState("copied");
      }
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 2400);
  };

  const label =
    state === "copied"
      ? "コピーしました"
      : state === "error"
        ? "コピー失敗"
        : "リンクをコピー";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className="min-h-[3rem] border border-line px-8 py-3 font-serif-jp text-sm tracking-[0.25em] text-muted transition hover:border-accent hover:text-accent active:border-accent active:text-accent"
    >
      {label}
    </button>
  );
}

function SectionTitle({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="font-serif-jp text-xs tracking-[0.3em] text-muted"
    >
      {children}
    </h2>
  );
}

function Divider() {
  return <div className="h-px w-full bg-line" role="presentation" />;
}
