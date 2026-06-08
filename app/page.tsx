import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Hero } from "@/components/Home/Hero";
import { LessonSourceChooser } from "@/components/Home/LessonSourceChooser";
import { StatsCard } from "@/components/Home/StatsCard";
import { getDailyLessonsBySource } from "@/lib/lessons";

export default function Home() {
  const lessons = getDailyLessonsBySource();

  return (
    <>
      <Navbar />
      <main className="candy-shell">
        <Hero />
        <LessonSourceChooser lessons={lessons} />
        <StatsCard />
      </main>
      <Footer />
    </>
  );
}
