import lessons from "@/data/lessons.json";
import { SOURCE_ORDER, type LessonSource } from "@/lib/sources";

export type VocabularyItem = {
  word: string;
  meaning: string;
  phonetic: string;
  example?: string;
};

export type Lesson = {
  id: string;
  slug: string;
  source: LessonSource;
  title: string;
  date: string;
  duration: number;
  audio: string;
  content: string;
  transcript?: string;
  pageUrl?: string;
  sentences: string[];
  vocabulary: VocabularyItem[];
};

export function getLessons(): Lesson[] {
  return lessons as Lesson[];
}

export function getDailyLesson(source: LessonSource = "easy"): Lesson {
  return getLessonsBySource(source)[0] ?? getLessons()[0];
}

export function getLessonsBySource(source: LessonSource): Lesson[] {
  return getLessons().filter((lesson) => lesson.source === source);
}

export function getDailyLessonsBySource(): Record<LessonSource, Lesson> {
  return SOURCE_ORDER.reduce(
    (items, source) => ({
      ...items,
      [source]: getDailyLesson(source)
    }),
    {} as Record<LessonSource, Lesson>
  );
}

export function getHistoryLessonsBySource(): Record<LessonSource, Lesson[]> {
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  return SOURCE_ORDER.reduce(
    (items, source) => {
      const lessons = getLessonsBySource(source)
        .filter((lesson) => new Date(`${lesson.date}T00:00:00`) >= twoMonthsAgo)
        .sort((a, b) => b.date.localeCompare(a.date));

      return {
        ...items,
        [source]: lessons
      };
    },
    {} as Record<LessonSource, Lesson[]>
  );
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return getLessons().find((lesson) => lesson.slug === slug);
}
