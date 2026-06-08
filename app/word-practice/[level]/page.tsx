import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { CandyLink } from "@/components/UI/CandyLink";
import { WordPracticeClient } from "@/components/WordPractice/WordPracticeClient";
import {
  getWordbookEntriesByLevel,
  getWordbookLevel,
  WORDBOOK_LEVELS,
  type WordbookLevelSlug
} from "@/lib/wordbook";

export function generateStaticParams() {
  return WORDBOOK_LEVELS.map((level) => ({
    level: level.slug
  }));
}

export default async function WordPracticePage({
  params
}: {
  params: Promise<{ level: string }>;
}) {
  const { level: levelSlug } = await params;
  const level = getWordbookLevel(levelSlug);

  if (!level) {
    notFound();
  }

  const words = getWordbookEntriesByLevel(level.slug as WordbookLevelSlug);

  return (
    <>
      <Navbar />
      <main>
        <div className="candy-shell pt-6">
          <CandyLink href="/" tone="plain">
            <ArrowLeft size={17} />
            返回首页
          </CandyLink>
        </div>
        <WordPracticeClient level={level} words={words} />
      </main>
      <Footer />
    </>
  );
}
