"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGame } from "@/store/game";

// 1エラあたりの表示時間（ms）。
export const ERA_DURATION_MS = 700;
// 最初の "六つの時代を…" 表示から最初のエラ表示までの余白。
export const OPENING_MS = 500;
// 最後のエラ表示から result 遷移までの余白。
export const CLOSING_MS = 500;

export function SimulatingScreen() {
  const eras = useGame((s) => s.eras);
  const history = useGame((s) => s.finalCreature?.eraHistory);

  const [currentIdx, setCurrentIdx] = useState(-1);

  useEffect(() => {
    if (!history) return;
    const timers: number[] = [];
    for (let i = 0; i < history.length; i++) {
      timers.push(
        window.setTimeout(
          () => setCurrentIdx(i),
          OPENING_MS + i * ERA_DURATION_MS,
        ),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [history]);

  if (!eras || !history) return <Fallback />;

  const result = currentIdx >= 0 && currentIdx < history.length
    ? history[currentIdx]
    : null;
  const era = result ? eras[result.eraIndex] : null;

  return (
    <main
      className="flex flex-1 flex-col items-center justify-center px-5 py-16 sm:px-6 sm:py-20"
      aria-labelledby="simulating-label"
    >
      <div className="w-full max-w-xl text-center">
        <p
          id="simulating-label"
          className="font-serif-jp text-xs tracking-[0.4em] text-muted"
        >
          SIMULATING
        </p>

        <div
          className="relative mt-10 min-h-[11rem] sm:mt-12"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            {era && result ? (
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
                className="space-y-3"
              >
                <p className="font-serif-jp text-[0.7rem] tracking-[0.35em] text-muted">
                  第{result.eraIndex + 1}期 ・ {era.title}
                </p>
                <h2 className="font-serif-jp text-2xl leading-relaxed tracking-wider sm:text-3xl">
                  {era.biomeLabel}
                </h2>
                <p className="mx-auto max-w-md text-sm leading-7 text-foreground/70 sm:text-base">
                  {oneLine(result.narrative)}
                </p>
                {result.extinct && (
                  <p className="pt-2 font-serif-jp text-xs tracking-[0.4em] text-muted">
                    — 絶滅 —
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="opening"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="space-y-3"
              >
                <h2 className="font-serif-jp text-2xl leading-relaxed tracking-wider">
                  六つの時代を、
                  <br />
                  生き抜いていく…
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="mx-auto mt-10 flex items-center justify-center gap-1.5 sm:mt-12"
          role="progressbar"
          aria-label="進化の進捗"
          aria-valuemin={0}
          aria-valuemax={history.length}
          aria-valuenow={Math.max(0, currentIdx + 1)}
        >
          {history.map((h, i) => {
            const active = i <= currentIdx;
            const extinct = h.extinct;
            return (
              <motion.div
                key={i}
                aria-hidden="true"
                className={`h-[2px] w-10 ${
                  active
                    ? extinct
                      ? "bg-muted"
                      : "bg-accent"
                    : "bg-line"
                }`}
                initial={false}
                animate={{
                  scaleX: active ? 1 : 0.4,
                  opacity: active ? 1 : 0.4,
                }}
                transition={{ duration: 0.35 }}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

/** 2文目以降を落とし、1文に整形する。 */
function oneLine(narrative: string | undefined): string {
  if (!narrative) return "";
  const idx = narrative.indexOf("。");
  if (idx < 0) return narrative;
  return narrative.slice(0, idx + 1);
}

function Fallback() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <p className="font-serif-jp text-xs tracking-[0.4em] text-muted">
        SIMULATING…
      </p>
    </main>
  );
}
