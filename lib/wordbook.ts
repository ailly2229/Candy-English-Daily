import wordbook from "@/data/wordbook.json";

export type WordLevel = "A2" | "B1" | "B2" | "C1" | "C2" | "Phrases";
export type WordCategory = "word" | "phrase";

export type WordbookItem = {
  word: string;
  level: WordLevel;
  category: WordCategory;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  meaning: string;
  example: string;
  exampleZh: string;
  cambridgeUrl: string;
};

export const WORD_LEVELS: WordLevel[] = ["A2", "B1", "B2", "C1", "C2", "Phrases"];

export function getWordbook(): WordbookItem[] {
  return wordbook as WordbookItem[];
}
