import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { HistoryList } from "@/components/Home/HistoryList";
import { Hero } from "@/components/Home/Hero";
import { LessonSourceChooser } from "@/components/Home/LessonSourceChooser";
import { WordPracticeChooser } from "@/components/Home/WordPracticeChooser";
import { WordbookTrainer } from "@/components/Home/WordbookTrainer";
import { getDailyLessonsBySource, getHistoryLessonsBySource } from "@/lib/lessons";
import { getWordbookSummaries } from "@/lib/wordbook";

export default function Home() {
  const lessons = getDailyLessonsBySource();
  const historyLessons = getHistoryLessonsBySource();
  const wordbookLevels = getWordbookSummaries();

  return (
    <>
      <Navbar />
      <main className="candy-shell">
        <Hero />
        <LessonSourceChooser lessons={lessons} />
        <WordbookTrainer levels={wordbookLevels} />
        <WordPracticeChooser levels={wordbookLevels} />
        <HistoryList lessons={historyLessons} />
      </main>
      <Footer />
    </>
  );
}
