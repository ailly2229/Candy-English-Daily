import pocketEnglish from "@/data/pocket-english.json";
import type { VocabularyItem } from "@/lib/lessons";

export type PocketEnglishItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  url: string;
  audio: string;
  transcript: string;
  vocabulary: VocabularyItem[];
};

export function getPocketEnglishItems(): PocketEnglishItem[] {
  return pocketEnglish as PocketEnglishItem[];
}

export function getRecentPocketEnglishItems(): PocketEnglishItem[] {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return getPocketEnglishItems()
    .filter((item) => new Date(`${item.date}T00:00:00`) >= sixMonthsAgo)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPocketEnglishBySlug(slug: string): PocketEnglishItem | undefined {
  return getPocketEnglishItems().find((item) => item.slug === slug);
}
