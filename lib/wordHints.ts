import type { VocabularyItem } from "@/lib/lessons";

export type WordLevel = "B1" | "B2" | "C1" | "C2";

export type TranscriptWordHint = {
  word: string;
  meaning: string;
  phonetic: string;
  level: WordLevel;
  example?: string;
};

const B_LEVEL_WORDS: Record<string, TranscriptWordHint> = {
  affect: { word: "affect", meaning: "影响；触动", phonetic: "/əˈfekt/", level: "B1" },
  ambition: { word: "ambition", meaning: "抱负；雄心", phonetic: "/æmˈbɪʃn/", level: "B2" },
  alliteration: { word: "alliteration", meaning: "头韵", phonetic: "/əˌlɪtəˈreɪʃn/", level: "C1" },
  assonance: { word: "assonance", meaning: "谐元音；准押韵", phonetic: "/ˈæsənəns/", level: "C1" },
  biodiversity: { word: "biodiversity", meaning: "生物多样性", phonetic: "/ˌbaɪəʊdaɪˈvɜːsəti/", level: "C1" },
  climate: { word: "climate", meaning: "气候", phonetic: "/ˈklaɪmət/", level: "B1" },
  communication: { word: "communication", meaning: "沟通；传播", phonetic: "/kəˌmjuːnɪˈkeɪʃn/", level: "B1" },
  complex: { word: "complex", meaning: "复杂的", phonetic: "/ˈkɒmpleks/", level: "B1" },
  conference: { word: "conference", meaning: "会议", phonetic: "/ˈkɒnfərəns/", level: "B1" },
  conversation: { word: "conversation", meaning: "对话；交谈", phonetic: "/ˌkɒnvəˈseɪʃn/", level: "B1" },
  emotion: { word: "emotion", meaning: "情绪；情感", phonetic: "/ɪˈməʊʃn/", level: "B1" },
  emotionally: { word: "emotionally", meaning: "情感上地", phonetic: "/ɪˈməʊʃənəli/", level: "B2" },
  environmental: { word: "environmental", meaning: "环境的", phonetic: "/ɪnˌvaɪrənˈmentl/", level: "B1" },
  episode: { word: "episode", meaning: "一集；一段经历", phonetic: "/ˈepɪsəʊd/", level: "B1" },
  fascinated: { word: "fascinated", meaning: "着迷的", phonetic: "/ˈfæsɪneɪtɪd/", level: "B2" },
  global: { word: "global", meaning: "全球的", phonetic: "/ˈɡləʊbl/", level: "B1" },
  goosebumps: { word: "goosebumps", meaning: "鸡皮疙瘩", phonetic: "/ˈɡuːsbʌmps/", level: "B2" },
  impenetrable: { word: "impenetrable", meaning: "难以理解的；无法进入的", phonetic: "/ɪmˈpenɪtrəbl/", level: "C1" },
  instantly: { word: "instantly", meaning: "立刻；马上", phonetic: "/ˈɪnstəntli/", level: "B2" },
  jargon: { word: "jargon", meaning: "行话；术语", phonetic: "/ˈdʒɑːɡən/", level: "C1" },
  meaningful: { word: "meaningful", meaning: "有意义的", phonetic: "/ˈmiːnɪŋfəl/", level: "B1" },
  particular: { word: "particular", meaning: "特定的；特别的", phonetic: "/pəˈtɪkjələ(r)/", level: "B1" },
  perform: { word: "perform", meaning: "表演；执行", phonetic: "/pəˈfɔːm/", level: "B1" },
  poetry: { word: "poetry", meaning: "诗歌", phonetic: "/ˈpəʊətri/", level: "B2" },
  profession: { word: "profession", meaning: "职业；行业", phonetic: "/prəˈfeʃn/", level: "B1" },
  project: { word: "project", meaning: "项目；计划", phonetic: "/ˈprɒdʒekt/", level: "B1" },
  recite: { word: "recite", meaning: "朗诵；背诵", phonetic: "/rɪˈsaɪt/", level: "B2" },
  research: { word: "research", meaning: "研究", phonetic: "/rɪˈsɜːtʃ/", level: "B1" },
  simile: { word: "simile", meaning: "明喻", phonetic: "/ˈsɪməli/", level: "B2" },
  spiritual: { word: "spiritual", meaning: "精神上的；心灵的", phonetic: "/ˈspɪrɪtʃuəl/", level: "B2" },
  specialist: { word: "specialist", meaning: "专业的；专家", phonetic: "/ˈspeʃəlɪst/", level: "B2" },
  technical: { word: "technical", meaning: "技术的；专业的", phonetic: "/ˈteknɪkl/", level: "B1" },
  vocabulary: { word: "vocabulary", meaning: "词汇", phonetic: "/vəˈkæbjələri/", level: "B1" },
  worksheet: { word: "worksheet", meaning: "练习表", phonetic: "/ˈwɜːkʃiːt/", level: "B1" },
  "come to terms": { word: "come to terms", meaning: "接受；适应", phonetic: "/kʌm tə tɜːmz/", level: "B2" },
  "get back in touch": { word: "get back in touch", meaning: "重新取得联系", phonetic: "/ɡet bæk ɪn tʌtʃ/", level: "B1" },
  "get goose bumps": { word: "get goose bumps", meaning: "起鸡皮疙瘩", phonetic: "/ɡet ˈɡuːs bʌmps/", level: "B2" },
  "keep in touch": { word: "keep in touch", meaning: "保持联系", phonetic: "/kiːp ɪn tʌtʃ/", level: "B1" },
  "lose touch": { word: "lose touch", meaning: "失去联系", phonetic: "/luːz tʌtʃ/", level: "B1" },
  "open mic night": { word: "open mic night", meaning: "开放麦之夜", phonetic: "/ˌəʊpən ˈmaɪk naɪt/", level: "B2" },
  "touch your soul": { word: "touch your soul", meaning: "触动心灵", phonetic: "/tʌtʃ jɔː səʊl/", level: "B2" },
  "turn-off": { word: "turn-off", meaning: "令人失去兴趣的事物", phonetic: "/ˈtɜːn ɒf/", level: "B2" }
};

export function normalizeHintKey(value: string): string {
  return value.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
}

export function createTranscriptHints(vocabulary: VocabularyItem[]) {
  const hints = new Map<string, TranscriptWordHint>();

  Object.values(B_LEVEL_WORDS).forEach((hint) => {
    hints.set(normalizeHintKey(hint.word), hint);
  });

  vocabulary.forEach((item) => {
    const existing = hints.get(normalizeHintKey(item.word));
    hints.set(normalizeHintKey(item.word), {
      word: item.word,
      meaning: item.meaning,
      phonetic: item.phonetic || existing?.phonetic || "",
      level: existing?.level ?? "B1",
      example: item.example
    });
  });

  return hints;
}
