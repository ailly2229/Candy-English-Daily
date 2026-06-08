"use client";

import { type MouseEvent, type ReactNode, useMemo, useState } from "react";
import { ExternalLink, FileText, Search, Volume2 } from "lucide-react";
import { CandyButton } from "@/components/UI/CandyButton";
import { CandyCard } from "@/components/UI/CandyCard";
import type { VocabularyItem } from "@/lib/lessons";
import { createTranscriptHints, normalizeHintKey, type TranscriptWordHint } from "@/lib/wordHints";

type SelectedHint = {
  hint: TranscriptWordHint;
  x: number;
  y: number;
};

const levelStyles = {
  B1: "bg-[#91E4DC]/85 hover:bg-[#78DAD1]",
  B2: "bg-[#B8E879]/85 hover:bg-[#A5DF63]",
  C1: "bg-[#FFF171]/90 hover:bg-[#FFE95A]",
  C2: "bg-[#FFC971]/90 hover:bg-[#FFB84A]"
};

const speakerPattern = /^[A-Z][A-Za-z\s'-]{1,24}$/;
const wordPattern = /[A-Za-z]+(?:[-'][A-Za-z]+)*/g;

export function ArticleViewer({
  content,
  pageUrl,
  vocabulary
}: {
  content: string;
  pageUrl?: string;
  vocabulary: VocabularyItem[];
}) {
  const [visible, setVisible] = useState(true);
  const [selectedHint, setSelectedHint] = useState<SelectedHint | null>(null);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const transcriptLines = content.split(/\n+/).map((item) => item.trim()).filter(Boolean);
  const hints = useMemo(() => createTranscriptHints(vocabulary), [vocabulary]);
  const maxPhraseLength = useMemo(
    () => Math.max(...Array.from(hints.keys()).map((key) => key.split(" ").length), 1),
    [hints]
  );

  function speak(word: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  function saveWord(hint: TranscriptWordHint) {
    const key = "candy-english-words";
    const current = JSON.parse(window.localStorage.getItem(key) ?? "[]") as TranscriptWordHint[];
    const exists = current.some((item) => normalizeHintKey(item.word) === normalizeHintKey(hint.word));

    if (!exists) {
      window.localStorage.setItem(key, JSON.stringify([...current, hint]));
    }

    setSavedWords((items) => new Set(items).add(normalizeHintKey(hint.word)));
  }

  function openHint(event: MouseEvent<HTMLButtonElement>, hint: TranscriptWordHint) {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedHint({
      hint,
      x: Math.min(Math.max(rect.left + rect.width / 2, 170), window.innerWidth - 170),
      y: Math.max(rect.top - 18, 120)
    });
  }

  function findHint(words: string[]) {
    const phrase = normalizeHintKey(words.join(" "));
    const exact = hints.get(phrase);
    if (exact) return exact;

    if (words.length === 1) {
      const singular = phrase.endsWith("s") ? phrase.slice(0, -1) : phrase;
      return hints.get(singular);
    }

    return undefined;
  }

  function renderInteractiveLine(line: string) {
    const matches = Array.from(line.matchAll(wordPattern)).map((match) => ({
      word: match[0],
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length
    }));
    const nodes: ReactNode[] = [];
    let cursor = 0;
    let wordIndex = 0;

    while (wordIndex < matches.length) {
      let selected:
        | {
            hint: TranscriptWordHint;
            start: number;
            end: number;
            length: number;
          }
        | undefined;

      for (let length = Math.min(maxPhraseLength, matches.length - wordIndex); length >= 1; length -= 1) {
        const words = matches.slice(wordIndex, wordIndex + length).map((match) => match.word);
        const hint = findHint(words);
        if (hint) {
          selected = {
            hint,
            start: matches[wordIndex].start,
            end: matches[wordIndex + length - 1].end,
            length
          };
          break;
        }
      }

      if (!selected) {
        wordIndex += 1;
        continue;
      }

      if (selected.start > cursor) {
        nodes.push(line.slice(cursor, selected.start));
      }

      nodes.push(
        <button
          key={`${selected.start}-${selected.end}-${selected.hint.word}`}
          className={`mx-[1px] rounded-sm px-0.5 pb-0.5 text-left font-semibold text-slate-950 underline decoration-transparent decoration-4 underline-offset-[5px] transition ${levelStyles[selected.hint.level]}`}
          type="button"
          onClick={(event) => openHint(event, selected.hint)}
        >
          {line.slice(selected.start, selected.end)}
        </button>
      );

      cursor = selected.end;
      wordIndex += selected.length;
    }

    if (cursor < line.length) {
      nodes.push(line.slice(cursor));
    }

    return nodes;
  }

  return (
    <section className="relative py-8" onClick={() => setSelectedHint(null)}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF8FF] text-[#2183BD]">
            <FileText size={22} />
          </span>
          <h2 className="text-2xl font-black text-slate-950">Transcript</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {pageUrl ? (
            <a
              className="candy-button inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700"
              href={pageUrl}
              rel="noreferrer"
              target="_blank"
            >
              BBC 原文
              <ExternalLink size={16} />
            </a>
          ) : null}
          <CandyButton tone="plain" onClick={() => setVisible((current) => !current)}>
            {visible ? "隐藏文本" : "显示文本"}
          </CandyButton>
        </div>
      </div>

      {visible ? (
        <CandyCard className="mx-auto max-w-[860px] bg-[#FFF9F2] p-5 shadow-[0_18px_50px_rgba(31,41,55,0.10)] sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#F2E7DA] pb-4">
            <div className="flex items-center gap-2 text-sm font-black text-slate-500">
              <span className="h-3 w-8 rounded-full bg-[#91E4DC]" />
              B1
              <span className="h-3 w-8 rounded-full bg-[#B8E879]" />
              B2
              <span className="h-3 w-8 rounded-full bg-[#FFF171]" />
              C1+
            </div>
            <p className="text-sm font-bold text-slate-400">点击高亮词查看中文解释和发音</p>
          </div>

          <div className="space-y-5 font-serif text-2xl leading-[1.85] text-slate-900 sm:text-3xl sm:leading-[1.9]">
            {transcriptLines.map((line, index) => {
              const isSpeaker = speakerPattern.test(line);

              return (
                <p
                  key={`${line}-${index}`}
                  className={isSpeaker ? "pt-4 font-sans text-base font-black leading-6 text-[#FF4D9A]" : ""}
                >
                  {isSpeaker ? line : renderInteractiveLine(line)}
                </p>
              );
            })}
          </div>
        </CandyCard>
      ) : null}

      {selectedHint ? (
        <div
          className="fixed z-40 w-[min(330px,calc(100vw-32px))] -translate-x-1/2 rounded-[24px] bg-white p-5 text-center shadow-[0_24px_70px_rgba(31,41,55,0.24)]"
          style={{ left: selectedHint.x, top: selectedHint.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-3xl font-black text-slate-950">{selectedHint.hint.word}</p>
          <p className="mt-2 text-lg font-bold text-slate-400">
            {selectedHint.hint.phonetic || "/ pronunciation /"}
          </p>
          <p className="mt-4 text-xl font-black text-slate-600">{selectedHint.hint.meaning}</p>

          <div className="mt-5 grid grid-cols-[1fr_1fr_2fr] gap-3">
            <button
              className="grid min-h-16 place-items-center rounded-2xl bg-slate-100 text-sm font-black text-slate-500"
              type="button"
              onClick={() => saveWord(selectedHint.hint)}
            >
              {savedWords.has(normalizeHintKey(selectedHint.hint.word)) ? "已添加" : "添加到"}
            </button>
            <a
              className="grid min-h-16 place-items-center rounded-2xl bg-slate-950 text-white"
              href={`https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(selectedHint.hint.word)}`}
              aria-label={`查询 ${selectedHint.hint.word}`}
              rel="noreferrer"
              target="_blank"
            >
              <Search size={28} />
              <span className="text-sm font-black">查询</span>
            </a>
            <button
              className="grid min-h-16 place-items-center rounded-2xl bg-[#0B7CFF] text-white"
              type="button"
              aria-label={`播放 ${selectedHint.hint.word} 发音`}
              onClick={() => speak(selectedHint.hint.word)}
            >
              <Volume2 size={34} />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
