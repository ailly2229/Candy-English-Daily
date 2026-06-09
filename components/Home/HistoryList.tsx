"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, CalendarDays, Sparkles } from "lucide-react";
import { CandyCard } from "@/components/UI/CandyCard";
import { CandyLink } from "@/components/UI/CandyLink";
import { formatLessonDate } from "@/lib/format";
import type { Lesson } from "@/lib/lessons";
import { LESSON_SOURCES, SOURCE_ORDER, type LessonSource } from "@/lib/sources";

export function HistoryList({ lessons }: { lessons: Record<LessonSource, Lesson[]> }) {
  const [selectedSource, setSelectedSource] = useState<LessonSource>("easy");
  const selectedLessons = lessons[selectedSource];

  return (
    <section className="py-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#6EC6FF]">History</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">6Min英语课程</h2>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-full border border-slate-100 bg-white p-1 shadow-sm">
          {SOURCE_ORDER.map((sourceId) => {
            const source = LESSON_SOURCES[sourceId];
            const active = selectedSource === sourceId;
            const Icon = sourceId === "easy" ? Sparkles : BookOpenCheck;

            return (
              <button
                key={sourceId}
                className={`relative min-h-11 rounded-full px-4 text-sm font-black transition ${
                  active ? "text-slate-950" : "text-slate-400 hover:text-slate-700"
                }`}
                type="button"
                onClick={() => setSelectedSource(sourceId)}
              >
                {active ? (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-[#EAF8FF]"
                    layoutId="history-source-pill"
                  />
                ) : null}
                <span className="relative inline-flex items-center gap-2">
                  <Icon size={16} color={active ? "#2183BD" : "currentColor"} />
                  {source.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <CandyCard className="overflow-hidden">
        <div className="divide-y divide-slate-100">
          {selectedLessons.length > 0 ? (
            selectedLessons.map((lesson) => (
              <CandyLink
                key={lesson.id}
                href={`/lesson/${lesson.slug}`}
                tone="plain"
                className="w-full justify-start rounded-none border-0 px-5 py-4 text-left shadow-none hover:bg-slate-50 sm:px-6"
                aria-label={`打开历史课程 ${lesson.title}`}
              >
                <CalendarDays size={18} className="shrink-0 text-[#FF7EB6]" />
                <span className="min-w-0 text-base font-black text-slate-800">
                  {formatLessonDate(lesson.date)} · {lesson.title}
                </span>
              </CandyLink>
            ))
          ) : (
            <div className="px-6 py-8 text-sm font-bold text-slate-400">暂无历史课程</div>
          )}
        </div>
      </CandyCard>
    </section>
  );
}
