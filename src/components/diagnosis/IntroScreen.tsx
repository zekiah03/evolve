"use client";

import { useGame } from "@/store/game";

export function IntroScreen() {
  const start = useGame((s) => s.start);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl space-y-10 text-center">
        <p className="font-serif-jp text-sm tracking-[0.3em] text-muted">
          EVOLUTION DIAGNOSIS
        </p>
        <h1 className="font-serif-jp text-3xl font-medium leading-relaxed tracking-wide sm:text-4xl">
          もし、あなたが
          <br />
          感情を持たずに
          <br />
          生き延びる生物だったら。
        </h1>
        <p className="text-sm leading-7 text-muted">
          十二の問いに答えてください。
          <br />
          最初の六問は、あなたが感情をどう扱うか。
          <br />
          次の六問は、あなたが惹かれる風景。
          <br />
          その答えから、六つの時代を生き抜く生命体を描きます。
        </p>
        <div className="pt-4">
          <button
            className="border border-accent px-10 py-3 font-serif-jp text-sm tracking-[0.2em] text-accent transition hover:bg-accent hover:text-background"
            type="button"
            onClick={start}
          >
            始める
          </button>
        </div>
        <p className="pt-8 text-xs text-muted">
          ※ 診断は約 3〜5 分です。途中で戻ることはできません。
        </p>
      </div>
    </main>
  );
}
