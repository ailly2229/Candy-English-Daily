import { notFound } from "next/navigation";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { LessonWorkspace } from "@/components/Lesson/LessonWorkspace";
import { getLessonBySlug, getLessons } from "@/lib/lessons";

export function generateStaticParams() {
  return getLessons().map((lesson) => ({
    slug: lesson.slug
  }));
}

export default async function LessonPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <LessonWorkspace lesson={lesson} />
      <Footer />
    </>
  );
}
