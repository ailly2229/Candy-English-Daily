import cefrWordbook from "@/data/cefr-wordbook.json";

export type WordbookLevelSlug = "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "academic-ngo";

export type WordbookLevel = {
  slug: WordbookLevelSlug;
  label: string;
  title: string;
  description: string;
  accent: string;
};

export type WordbookHeadword = {
  id: number;
  headword: string;
  lemma: string;
  level: WordbookLevelSlug;
  cefrEstimate: string | null;
  sourceLayer: string | null;
  topic: string;
  frequencyRank: number | null;
  zipfFrequency: number | null;
  includePriority: string | null;
  meaning?: string | null;
  partOfSpeech?: string | null;
  definition?: string | null;
  example?: string | null;
  exampleZh?: string | null;
  collocation?: string | null;
};

export const WORDBOOK_LEVELS: WordbookLevel[] = [
  {
    slug: "a1",
    label: "A1",
    title: "A1",
    description: "最基础的高频词，适合建立日常表达底座。",
    accent: "bg-[#91E4DC]"
  },
  {
    slug: "a2",
    label: "A2",
    title: "A2",
    description: "日常场景中更丰富的动作、人物和事件词。",
    accent: "bg-[#B8E879]"
  },
  {
    slug: "b1",
    label: "B1",
    title: "B1",
    description: "能支撑观点表达、新闻理解和常见话题讨论。",
    accent: "bg-[#FFC971]"
  },
  {
    slug: "b2",
    label: "B2",
    title: "B2",
    description: "更适合 BBC 文章、观点类文本和抽象表达。",
    accent: "bg-[#FF7EB6]"
  },
  {
    slug: "c1",
    label: "C1",
    title: "C1",
    description: "高阶阅读、演讲和较复杂文本中的核心词。",
    accent: "bg-[#BFA2FF]"
  },
  {
    slug: "c2",
    label: "C2",
    title: "C2",
    description: "更精细、正式和学术化的高级词汇。",
    accent: "bg-slate-950"
  },
  {
    slug: "academic-ngo",
    label: "Academic&NGO",
    title: "Academic&NGO",
    description: "学术、公益、国际组织和社会议题常用词。",
    accent: "bg-[#6EC6FF]"
  }
];

export function getWordbookEntries(): WordbookHeadword[] {
  return cefrWordbook as WordbookHeadword[];
}

export function getWordbookLevel(slug: string) {
  return WORDBOOK_LEVELS.find((level) => level.slug === slug);
}

export function getWordbookEntriesByLevel(slug: WordbookLevelSlug) {
  return getWordbookEntries().filter((word) => word.level === slug);
}

export function getWordbookSummaries() {
  const entries = getWordbookEntries();

  return WORDBOOK_LEVELS.map((level) => ({
    ...level,
    count: entries.filter((word) => word.level === level.slug).length
  }));
}
