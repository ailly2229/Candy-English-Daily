export const LESSON_SOURCES = {
  easy: {
    id: "easy",
    label: "简单",
    name: "Learning Easy English",
    badge: "Real Easy English",
    description: "真实对话、词汇更基础，适合轻松跟读和建立信心。",
    feedUrl: "https://podcasts.files.bbci.co.uk/p0hsrwv5.rss"
  },
  standard: {
    id: "standard",
    label: "普通",
    name: "6 Minute English",
    badge: "BBC 6 Minute English",
    description: "话题更丰富、表达更自然，适合常规听力和词汇训练。",
    feedUrl: "https://podcasts.files.bbci.co.uk/p02pc9tn.rss"
  }
} as const;

export type LessonSource = keyof typeof LESSON_SOURCES;

export const SOURCE_ORDER: LessonSource[] = ["easy", "standard"];
