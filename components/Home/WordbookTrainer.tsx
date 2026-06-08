"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Keyboard, Volume2, XCircle } from "lucide-react";
import { CandyButton } from "@/components/UI/CandyButton";
import { CandyCard } from "@/components/UI/CandyCard";
import type { WordLevel, WordbookItem } from "@/lib/wordbook";
import { WORD_LEVELS } from "@/lib/wordbook";

type CheckState = "idle" | "correct" | "wrong";

const levelColors: Record<WordLevel, string> = {
  A2: "bg-[#91E4DC] text-slate-950",
  B1: "bg-[#B8E879] text-slate-950",
  B2: "bg-[#FFC971] text-slate-950",
  C1: "bg-[#BFA2FF] text-slate-950"
};

function maskWord(word: string) {
  if (word.length <= 3) {
    return `${word[0]} ${"_ ".repeat(Math.max(1, word.length - 1)).trim()}`;
  }

  return word
    .split("")
    .map((letter, index) => (index === 0 || index === word.length - 1 ? letter : "_"))
    .join(" ");
}

export function WordbookTrainer({ words }: { words: WordbookItem[] }) {
  const [level, setLevel] = useState<WordLevel>("A2");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checkState, setCheckState] = useState<CheckState>("idle");

  const levelWords = useMemo(() => words.filter((word) => word.level === level), [level, words]);
  const currentWord = levelWords[index % Math.max(1, levelWords.length)];

  function speak(value: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  function switchLevel(nextLevel: WordLevel) {
    setLevel(nextLevel);
    setIndex(0);
    setAnswer("");
    setCheckState("idle");
  }

  function checkAnswer() {
    const normalizedAnswer = answer.trim().toLowerCase();
    setCheckState(normalizedAnswer === currentWord.word.toLowerCase() ? "correct" : "wrong");
  }

  function nextWord() {
    setIndex((current) => (current + 1) % Math.max(1, levelWords.length));
    setAnswer("");
    setCheckState("idle");
  }

  if (!currentWord) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#7AE582]">Wordbook</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">单词本</h2>
        </div>

        <div className="grid grid-cols-4 gap-2 rounded-full border border-slate-100 bg-white p-1 shadow-sm">
          {WORD_LEVELS.map((item) => {
            const active = level === item;

            return (
              <button
                key={item}
                className={`relative min-h-11 rounded-full px-4 text-sm font-black transition ${
                  active ? "text-slate-950" : "text-slate-400 hover:text-slate-700"
                }`}
                type="button"
                onClick={() => switchLevel(item)}
              >
                {active ? (
                  <motion.span className="absolute inset-0 rounded-full bg-[#ECFFF0]" layoutId="word-level-pill" />
                ) : null}
                <span className="relative">{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <CandyCard className="overflow-hidden bg-[#F8FBEE] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div>
            <div className="text-center">
              <h3 className="font-serif text-5xl font-black text-slate-950 sm:text-7xl">
                {currentWord.word.replaceAll("-", "·")}
              </h3>
              <div className="mt-5 flex items-center justify-center gap-3">
                <p className="text-2xl text-slate-700">{currentWord.phonetic}</p>
                <button
                  className="grid h-11 w-11 place-items-center rounded-full bg-[#7AE582] text-slate-950 shadow-md"
                  type="button"
                  aria-label={`播放 ${currentWord.word} 发音`}
                  onClick={() => speak(currentWord.word)}
                >
                  <Volume2 size={24} />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-xl bg-slate-950 px-4 py-2 text-lg font-black italic text-white">
                {currentWord.partOfSpeech}
              </span>
              <span className={`rounded-full px-4 py-2 text-lg font-black ${levelColors[currentWord.level]}`}>
                {currentWord.level}
              </span>
            </div>

            <p className="mt-6 text-2xl leading-9 text-slate-800">{currentWord.definition}</p>
            <p className="mt-3 text-xl font-bold text-slate-500">{currentWord.meaning}</p>

            <div className="mt-8 border-t border-[#E4EED7] pt-6">
              <span className="rounded-xl bg-slate-950 px-4 py-2 text-lg font-black italic text-white">
                example
              </span>
              <p className="mt-6 text-2xl leading-9 text-slate-800">
                {currentWord.example.split(currentWord.word).map((part, partIndex, parts) => (
                  <span key={`${part}-${partIndex}`}>
                    {part}
                    {partIndex < parts.length - 1 ? <strong>{currentWord.word}</strong> : null}
                  </span>
                ))}
              </p>
              <p className="mt-3 text-xl leading-8 text-slate-500">{currentWord.exampleZh}</p>
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-5 shadow-[0_18px_45px_rgba(31,41,55,0.08)] sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FFF3F8] text-[#FF4D9A]">
                <Keyboard size={22} />
              </span>
              <h3 className="text-xl font-black text-slate-950">背单词</h3>
            </div>

            <p className="text-sm font-black text-slate-400">中文提示</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{currentWord.meaning}</p>

            <div className="mt-6 rounded-[20px] bg-[#FFF9F2] p-5 text-center font-serif text-3xl font-black tracking-normal text-slate-900">
              {maskWord(currentWord.word)}
            </div>

            <input
              className="mt-5 min-h-12 w-full rounded-full border border-slate-200 px-5 text-base font-bold outline-none transition focus:border-[#FF7EB6] focus:ring-4 focus:ring-[#FF7EB6]/15"
              placeholder="输入完整英文单词"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                setCheckState("idle");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && answer.trim()) {
                  checkAnswer();
                }
              }}
            />

            {checkState !== "idle" ? (
              <div
                className={`mt-4 flex items-start gap-2 rounded-[20px] p-4 text-sm font-black ${
                  checkState === "correct"
                    ? "bg-[#ECFFF0] text-[#218C3C]"
                    : "bg-[#FFF3F8] text-[#B52B70]"
                }`}
              >
                {checkState === "correct" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                <span>
                  {checkState === "correct" ? "拼写正确" : `再试一次，正确答案是 ${currentWord.word}`}
                </span>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3">
              <CandyButton onClick={checkAnswer} disabled={!answer.trim()}>
                检查答案
              </CandyButton>
              <CandyButton tone="plain" onClick={nextWord}>
                下一个
                <ChevronRight size={18} />
              </CandyButton>
            </div>
          </div>
        </div>
      </CandyCard>
    </section>
  );
}
