import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { HistoryList } from "@/components/Home/HistoryList";
import { Hero } from "@/components/Home/Hero";
import { LessonSourceChooser } from "@/components/Home/LessonSourceChooser";
import { PocketEnglish } from "@/components/Home/PocketEnglish";
import { WordPracticeChooser } from "@/components/Home/WordPracticeChooser";
import { WordbookTrainer } from "@/components/Home/WordbookTrainer";
import { getDailyLessonsBySource, getHistoryLessonsBySource } from "@/lib/lessons";
import { getPocketEnglishItems } from "@/lib/pocketEnglish";
import { getWordbookSummaries } from "@/lib/wordbook";

export default function Home() {
  const lessons = getDailyLessonsBySource();
  const historyLessons = getHistoryLessonsBySource();
  const wordbookLevels = getWordbookSummaries();
  const pocketEnglish = getPocketEnglishItems();

  return (
    <>
      <Navbar />
      <main className="candy-shell">
        <Hero />
        <LessonSourceChooser lessons={lessons} />
        <PocketEnglish items={pocketEnglish} />
        <WordbookTrainer levels={wordbookLevels} />
        <WordPracticeChooser levels={wordbookLevels} />
        <HistoryList lessons={historyLessons} />
      </main>
      <Footer />
    </>
  );
}
