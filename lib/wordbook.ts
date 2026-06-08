import wordbook from "@/data/wordbook.json";

export type WordLevel = "A2" | "B1" | "B2" | "C1";

export type WordbookItem = {
  word: string;
  level: WordLevel;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  meaning: string;
  example: string;
  exampleZh: string;
};

export const WORD_LEVELS: WordLevel[] = ["A2", "B1", "B2", "C1"];

export function getWordbook(): WordbookItem[] {
  return wordbook as WordbookItem[];
}
