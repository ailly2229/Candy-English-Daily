import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { HistoryList } from "@/components/Home/HistoryList";
import { Hero } from "@/components/Home/Hero";
import { LessonSourceChooser } from "@/components/Home/LessonSourceChooser";
import { getDailyLessonsBySource, getHistoryLessonsBySource } from "@/lib/lessons";

export default function Home() {
  const lessons = getDailyLessonsBySource();
  const historyLessons = getHistoryLessonsBySource();

  return (
    <>
      <Navbar />
      <main className="candy-shell">
        <Hero />
        <LessonSourceChooser lessons={lessons} />
        <HistoryList lessons={historyLessons} />
      </main>
      <Footer />
    </>
  );
}
