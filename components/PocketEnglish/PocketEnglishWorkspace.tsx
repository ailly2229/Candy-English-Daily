"use client";

import { ArrowLeft } from "lucide-react";
import { ArticleViewer } from "@/components/Lesson/ArticleViewer";
import { AudioPlayer } from "@/components/Lesson/AudioPlayer";
import { VocabularyGrid } from "@/components/Lesson/VocabularyGrid";
import { CandyLink } from "@/components/UI/CandyLink";
import { formatLessonDate } from "@/lib/format";
import type { PocketEnglishItem } from "@/lib/pocketEnglish";

export function PocketEnglishWorkspace({ lesson }: { lesson: PocketEnglishItem }) {
  return (
    <main className="candy-shell py-8">
      <CandyLink href="/pocket-english" tone="plain">
        <ArrowLeft size={18} />
        返回 Pocket English
      </CandyLink>

      <section className="py-8">
        <p className="text-sm font-black text-[#FF7EB6]">Pocket English 口袋英语</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-sm font-bold text-slate-400">{formatLessonDate(lesson.date)}</p>
      </section>

      {lesson.audio ? <AudioPlayer src={lesson.audio} /> : null}
      <VocabularyGrid vocabulary={lesson.vocabulary} showAll />
      <ArticleViewer content={lesson.transcript} pageUrl={lesson.url} vocabulary={lesson.vocabulary} />
    </main>
  );
}
