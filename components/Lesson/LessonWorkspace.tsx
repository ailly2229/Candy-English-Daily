"use client";

import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { ArticleViewer } from "@/components/Lesson/ArticleViewer";
import { AudioPlayer } from "@/components/Lesson/AudioPlayer";
import { DictationTrainer } from "@/components/Lesson/DictationTrainer";
import { VocabularyGrid } from "@/components/Lesson/VocabularyGrid";
import { WorksheetCard } from "@/components/Lesson/WorksheetCard";
import { CandyLink } from "@/components/UI/CandyLink";
import type { Lesson } from "@/lib/lessons";
import { formatLessonDate } from "@/lib/format";

export function LessonWorkspace({ lesson }: { lesson: Lesson }) {
  const startedAt = useMemo(() => Date.now(), []);

  return (
    <main className="candy-shell py-8">
      <CandyLink href="/" tone="plain">
        <ArrowLeft size={18} />
        返回首页
      </CandyLink>

      <section className="py-8">
        <p className="text-sm font-black text-[#FF7EB6]">Today's Lesson</p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
          {lesson.title}
        </h1>
        <p className="mt-3 text-sm font-bold text-slate-400">{formatLessonDate(lesson.date)}</p>
      </section>

      <AudioPlayer src={lesson.audio} />
      <VocabularyGrid vocabulary={lesson.vocabulary} />
      <ArticleViewer
        content={lesson.transcript ?? lesson.content}
        pageUrl={lesson.pageUrl}
        vocabulary={lesson.vocabulary}
      />
      <DictationTrainer lessonId={lesson.id} sentences={lesson.sentences} startedAt={startedAt} />
      <WorksheetCard worksheet={lesson.worksheet} />
    </main>
  );
}
