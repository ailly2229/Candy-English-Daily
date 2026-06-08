"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search, Volume2 } from "lucide-react";
import { CandyCard } from "@/components/UI/CandyCard";
import { speakBritishMale } from "@/lib/speech";
import type { WordbookHeadword, WordbookLevel } from "@/lib/wordbook";

export function WordbookLevelClient({
  level,
  words
}: {
  level: WordbookLevel;
  words: WordbookHeadword[];
}) {
  const [query, setQuery] = useState("");

  const filteredWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return words;

    return words.filter((word) => {
      const haystack = [word.headword, word.lemma, word.cefrEstimate, word.topic, word.sourceLayer]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, words]);

  return (
    <section className="candy-shell py-8">
      <CandyCard className="overflow-hidden bg-[#F8FBEE] p-5 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black text-[#FF7EB6]">Wordbook</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">{level.title}</h1>
            <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-500">{level.description}</p>
          </div>

          <div className="rounded-[22px] bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-black text-slate-400">当前词头</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{words.length.toLocaleString()}</p>
          </div>
        </div>

        <label className="mt-6 flex min-h-12 items-center gap-3 rounded-full bg-white px-5 shadow-sm ring-1 ring-slate-100 focus-within:ring-[#FF7EB6]/35">
          <Search size={20} className="text-slate-400" />
          <input
            className="min-w-0 flex-1 bg-transparent text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="搜索词头、CEFR、topic..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </CandyCard>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWords.map((word) => (
          <CandyCard key={`${word.level}-${word.id}-${word.headword}`} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-3xl font-black text-slate-950">{word.headword}</p>
                {word.lemma !== word.headword ? (
                  <p className="mt-1 text-sm font-bold text-slate-400">lemma: {word.lemma}</p>
                ) : null}
              </div>
              <button
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#7AE582] text-slate-950 shadow-sm"
                type="button"
                aria-label={`播放 ${word.headword} 发音`}
                onClick={() => speakBritishMale(word.headword, { rate: 0.82 })}
              >
                <Volume2 size={21} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-black ${
                  level.slug === "c2" ? "bg-slate-950 text-white" : `${level.accent} text-slate-950`
                }`}
              >
                {word.cefrEstimate ?? level.label}
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-black text-slate-500">
                {word.topic}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[18px] bg-[#FFF9F2] p-3">
                <p className="font-black text-slate-400">Frequency rank</p>
                <p className="mt-1 font-black text-slate-950">
                  {word.frequencyRank ? word.frequencyRank.toLocaleString() : "-"}
                </p>
              </div>
              <div className="rounded-[18px] bg-[#F3FBFF] p-3">
                <p className="font-black text-slate-400">Source</p>
                <p className="mt-1 line-clamp-2 font-black text-slate-950">{word.sourceLayer ?? "CEFR scaffold"}</p>
              </div>
            </div>

            <a
              className="candy-button mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700"
              href={`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/${encodeURIComponent(word.headword)}`}
              rel="noreferrer"
              target="_blank"
            >
              Cambridge 查询
              <ExternalLink size={16} />
            </a>
          </CandyCard>
        ))}
      </div>

      {filteredWords.length === 0 ? (
        <CandyCard className="mt-6 p-8 text-center">
          <p className="text-lg font-black text-slate-950">没有找到匹配的词头</p>
          <p className="mt-2 text-sm font-bold text-slate-400">换一个关键词再试试。</p>
        </CandyCard>
      ) : null}
    </section>
  );
}
