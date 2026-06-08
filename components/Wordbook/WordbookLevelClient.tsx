"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ExternalLink, Search, Volume2 } from "lucide-react";
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
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const storageKey = `candy-wordbook-known-${level.slug}`;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setKnownWords(new Set(JSON.parse(saved) as string[]));
      }
    } catch {
      setKnownWords(new Set());
    }
  }, [storageKey]);

  function toggleKnown(word: string) {
    setKnownWords((current) => {
      const next = new Set(current);

      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }

      window.localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      return next;
    });
  }

  const filteredWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return words;

    return words.filter((word) => {
      const haystack = [
        word.headword,
        word.lemma,
        word.cefrEstimate,
        word.topic,
        word.sourceLayer,
        word.meaning,
        word.partOfSpeech,
        word.definition,
        word.example,
        word.exampleZh,
        word.collocation
      ]
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
            <p className="text-sm font-black text-slate-400">当前单词</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{words.length.toLocaleString()}</p>
          </div>
        </div>

        <label className="mt-6 flex min-h-12 items-center gap-3 rounded-full bg-white px-5 shadow-sm ring-1 ring-slate-100 focus-within:ring-[#FF7EB6]/35">
          <Search size={20} className="text-slate-400" />
          <input
            className="min-w-0 flex-1 bg-transparent text-base font-bold text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="搜索单词、中文释义、例句..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </CandyCard>

      <div className="mt-6 space-y-3">
        {filteredWords.map((word) => {
          const known = knownWords.has(word.headword);

          return (
            <CandyCard
              key={`${word.level}-${word.id}-${word.headword}`}
              className={`p-4 transition ${
                known ? "bg-slate-100 opacity-45 grayscale" : "bg-white hover:shadow-[0_18px_42px_rgba(31,41,55,0.10)]"
              }`}
            >
              <div className="grid gap-4 lg:grid-cols-[auto_210px_minmax(0,1fr)_auto] lg:items-center">
                <button
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition ${
                    known ? "bg-slate-950 text-white" : "bg-[#ECFFF0] text-[#157A33] hover:bg-[#7AE582]"
                  }`}
                  type="button"
                  aria-pressed={known}
                  onClick={() => toggleKnown(word.headword)}
                >
                  <Check size={18} />
                  认识
                </button>

                <div className="min-w-0">
                  <p className="font-serif text-3xl font-black text-slate-950">{word.headword}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {word.partOfSpeech ? (
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                        {word.partOfSpeech}
                      </span>
                    ) : null}
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${level.accent} text-slate-950`}>
                      {word.cefrEstimate ?? level.label}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
                    <div>
                      <p className="text-lg font-black text-slate-800">{word.meaning ?? "-"}</p>
                      {word.definition ? (
                        <p className="mt-1 text-sm font-bold leading-6 text-slate-500">{word.definition}</p>
                      ) : null}
                    </div>
                    <div>
                      {word.example ? (
                        <p className="text-sm font-bold leading-6 text-slate-700">{word.example}</p>
                      ) : null}
                      {word.exampleZh ? (
                        <p className="mt-1 text-sm font-bold leading-6 text-slate-400">{word.exampleZh}</p>
                      ) : null}
                      {word.collocation ? (
                        <p className="mt-2 inline-flex rounded-full bg-[#FFF9F2] px-3 py-1 text-xs font-black text-[#9A5A00]">
                          {word.collocation}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 lg:justify-end">
                  <button
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#7AE582] text-slate-950 shadow-sm"
                    type="button"
                    aria-label={`播放 ${word.headword} 发音`}
                    onClick={() => speakBritishMale(word.headword, { rate: 0.82 })}
                  >
                    <Volume2 size={21} />
                  </button>
                  <a
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600"
                    href={`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/${encodeURIComponent(word.headword)}`}
                    rel="noreferrer"
                    target="_blank"
                    aria-label={`查询 ${word.headword}`}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </CandyCard>
          );
        })}
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
