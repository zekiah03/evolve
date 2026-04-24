"use client";

import { useGame } from "@/store/game";

// 第1版（仮）: 最終生物の概要を簡素に表示。
// 後のステップで演出付きの正式な結果画面に差し替える。
export function ResultScreen() {
  const finalCreature = useGame((s) => s.finalCreature);
  const eras = useGame((s) => s.eras);
  const reset = useGame((s) => s.reset);

  if (!finalCreature || !eras) return null;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-10">
        <header className="text-center">
          <p className="font-serif-jp text-xs tracking-[0.3em] text-muted">
            RESULT
          </p>
          <h2 className="mt-4 font-serif-jp text-2xl leading-relaxed tracking-wide">
            {finalCreature.alive
              ? "あなたの生命体は、時代を生き抜いた。"
              : "あなたの生命体は、どこかで絶えた。"}
          </h2>
        </header>

        <section className="space-y-1">
          <SectionTitle>系譜</SectionTitle>
          <ol className="divide-y divide-line">
            {finalCreature.eraHistory.map((result) => {
              const era = eras[result.eraIndex];
              return (
                <li key={result.eraIndex} className="py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif-jp text-sm tracking-wider">
                      第{result.eraIndex + 1}期 — {era.title}「{era.biomeLabel}」
                    </span>
                    <span className="text-xs text-muted">
                      ストレス {result.stress}
                      {result.extinct ? " / 絶滅" : ""}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-foreground/90">
                    {result.narrative}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="space-y-2">
          <SectionTitle>達成したマイルストーン（{finalCreature.milestones.length}）</SectionTitle>
          {finalCreature.milestones.length === 0 ? (
            <p className="text-sm text-muted">特筆すべき獲得なし。</p>
          ) : (
            <ul className="flex flex-wrap gap-2 text-xs">
              {finalCreature.milestones.map((id) => (
                <li
                  key={id}
                  className="border border-accent px-2.5 py-1 font-serif-jp tracking-wider"
                >
                  {id}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <SectionTitle>感情の芽生え</SectionTitle>
          <p className="text-sm text-muted">
            段階 {finalCreature.emotionAwakening} / 9
          </p>
        </section>

        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={reset}
            className="border border-accent px-8 py-2.5 font-serif-jp text-sm tracking-[0.2em] text-accent transition hover:bg-accent hover:text-background"
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
