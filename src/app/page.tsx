import type { Metadata } from "next";
import { DiagnosisFlow } from "@/components/diagnosis/DiagnosisFlow";
import { emotionToCreature } from "@/lib/engine/emotionToCreature";
import { environmentToEras } from "@/lib/engine/environmentToEras";
import { computeEmotionProfile } from "@/lib/engine/profile";
import { simulateAll } from "@/lib/engine/simulator";
import { generatePortrait } from "@/lib/narrative/generate";
import { decodeAnswers, SHARE_PARAM } from "@/lib/share";

const DEFAULT_TITLE = "進化診断 — 感情を持たぬ生物として";
const DEFAULT_DESCRIPTION =
  "あなたの感情と選んだ環境から、もし生き延びるとしたらどんな生命体になるかを描き出す診断。";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function extractCode(
  params: Record<string, string | string[] | undefined>,
): string | null {
  const raw = params[SHARE_PARAM];
  const code = typeof raw === "string" ? raw : null;
  if (!code) return null;
  return decodeAnswers(code) ? code : null;
}

export async function generateMetadata({
  searchParams,
}: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  const code = extractCode(params);
  if (!code) {
    return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  }

  const decoded = decodeAnswers(code)!;
  const initial = emotionToCreature(computeEmotionProfile(decoded.emotion));
  const eras = environmentToEras(decoded.environment);
  const final = simulateAll(initial, eras);
  const portrait = generatePortrait(final, eras);

  return {
    title: `${portrait.name} — 進化診断`,
    description: portrait.description,
    openGraph: {
      title: `${portrait.name} — 進化診断`,
      description: portrait.description,
    },
    twitter: {
      card: "summary",
      title: `${portrait.name} — 進化診断`,
      description: portrait.description,
    },
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const sharedCode = extractCode(params);
  return <DiagnosisFlow sharedCode={sharedCode} />;
}
