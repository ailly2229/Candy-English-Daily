"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpenCheck, Sparkles } from "lucide-react";
import { DailyLessonCard } from "@/components/Home/DailyLessonCard";
import type { Lesson } from "@/lib/lessons";
import { LESSON_SOURCES, SOURCE_ORDER, type LessonSource } from "@/lib/sources";

export function LessonSourceChooser({ lessons }: { lessons: Record<LessonSource, Lesson> }) {
  const [selectedSource, setSelectedSource] = useState<LessonSource>("easy");
  const selectedLesson = lessons[selectedSource];

  return (
    <section className="py-4">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#FF7EB6]">Choose Your Level</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">选择今天的学习难度</h2>
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
                    className="absolute inset-0 rounded-full bg-[#FFF3F8]"
                    layoutId="source-pill"
                  />
                ) : null}
                <span className="relative inline-flex items-center gap-2">
                  <Icon size={16} color={active ? "#FF7EB6" : "currentColor"} />
                  {source.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <DailyLessonCard lesson={selectedLesson} />
    </section>
  );
}
