import { notFound } from "next/navigation";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { PocketEnglishWorkspace } from "@/components/PocketEnglish/PocketEnglishWorkspace";
import { getPocketEnglishBySlug, getPocketEnglishItems } from "@/lib/pocketEnglish";

export function generateStaticParams() {
  return getPocketEnglishItems().map((lesson) => ({
    slug: lesson.slug
  }));
}

export default async function PocketEnglishLessonPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getPocketEnglishBySlug(slug);

  if (!lesson) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <PocketEnglishWorkspace lesson={lesson} />
      <Footer />
    </>
  );
}
