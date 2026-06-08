"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock3, Headphones } from "lucide-react";
import { CandyCard } from "@/components/UI/CandyCard";
import { CandyLink } from "@/components/UI/CandyLink";
import type { Lesson } from "@/lib/lessons";
import { formatLessonDate } from "@/lib/format";
import { LESSON_SOURCES } from "@/lib/sources";

export function DailyLessonCard({ lesson }: { lesson: Lesson }) {
  const source = LESSON_SOURCES[lesson.source];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -4 }}
    >
      <CandyCard className="overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF8FF] px-3 py-1 text-sm font-black text-[#2183BD]">
                <Headphones size={16} />
                {source.badge}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF7E6] px-3 py-1 text-sm font-black text-[#B46D00]">
                <Clock3 size={16} />
                {lesson.duration} 分钟学习
              </span>
            </div>
            <h2 className="text-2xl font-black leading-tight text-slate-950 sm:text-4xl">
              {lesson.title}
            </h2>
            <p className="mt-3 text-sm font-bold text-slate-400">{formatLessonDate(lesson.date)}</p>
            <p className="mt-3 inline-flex rounded-full bg-slate-50 px-3 py-1 text-sm font-black text-slate-500">
              {source.label} · {source.description}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">{lesson.content}</p>
          </div>

          <CandyLink
            href={`/lesson/${lesson.slug}`}
            className="w-full shrink-0 sm:w-auto"
            aria-label={`开始学习 ${lesson.title}`}
          >
            开始学习
            <ArrowRight size={18} />
          </CandyLink>
        </div>
      </CandyCard>
    </motion.div>
  );
}
