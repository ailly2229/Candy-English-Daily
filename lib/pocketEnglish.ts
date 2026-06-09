import pocketEnglish from "@/data/pocket-english.json";

export type PocketEnglishItem = {
  id: string;
  title: string;
  date: string;
  summary: string;
  url: string;
};

export function getPocketEnglishItems(): PocketEnglishItem[] {
  return pocketEnglish as PocketEnglishItem[];
}
