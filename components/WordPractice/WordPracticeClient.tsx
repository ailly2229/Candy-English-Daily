"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { CandyButton } from "@/components/UI/CandyButton";
import { CandyCard } from "@/components/UI/CandyCard";
import type { WordbookHeadword, WordbookLevel } from "@/lib/wordbook";

type CheckState = "idle" | "correct" | "wrong";

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function maskWord(word: string) {
  const letters = word.split("");
  const revealableIndexes = letters
    .map((letter, index) => (/[A-Za-z]/.test(letter) ? index : -1))
    .filter((index) => index >= 0);

  if (revealableIndexes.length <= 1) {
    return letters.map((letter) => (/[A-Za-z]/.test(letter) ? "_" : letter)).join(" ");
  }

  const minVisible = Math.max(1, Math.floor(revealableIndexes.length * 0.3));
  const maxVisible = Math.max(minVisible, Math.floor(revealableIndexes.length * 0.5));
  const visibleCount = minVisible + Math.floor(Math.random() * (maxVisible - minVisible + 1));
  const shuffledIndexes = [...revealableIndexes].sort(() => Math.random() - 0.5);
  const visibleIndexes = new Set(shuffledIndexes.slice(0, visibleCount));

  return letters
    .map((letter, index) => {
      if (!/[A-Za-z]/.test(letter)) return letter;
      return visibleIndexes.has(index) ? letter : "_";
    })
    .join(" ");
}

function randomIndex(total: number, currentIndex: number | null) {
  if (total <= 1) return 0;

  let next = Math.floor(Math.random() * total);
  while (next === currentIndex) {
    next = Math.floor(Math.random() * total);
  }

  return next;
}

export function WordPracticeClient({
  level,
  words
}: {
  level: WordbookLevel;
  words: WordbookHeadword[];
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const nextTimer = useRef<number | null>(null);
  const currentWord = words[wordIndex];

  const maskedWord = useMemo(() => {
    if (!currentWord) return "";
    return maskWord(currentWord.headword);
  }, [currentWord]);

  useEffect(() => {
    setWordIndex(randomIndex(words.length, null));
  }, [words.length]);

  useEffect(() => {
    return () => {
      if (nextTimer.current) {
        window.clearTimeout(nextTimer.current);
      }
    };
  }, []);

  function goNext() {
    if (nextTimer.current) {
      window.clearTimeout(nextTimer.current);
      nextTimer.current = null;
    }

    setWordIndex((current) => randomIndex(words.length, current));
    setAnswer("");
    setCheckState("idle");
  }

  function checkAnswer() {
    if (!currentWord || !answer.trim() || checkState === "correct") return;

    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(currentWord.headword);

    if (!isCorrect) {
      setCheckState("wrong");
      return;
    }

    setCheckState("correct");
    setCorrectCount((current) => current + 1);
    nextTimer.current = window.setTimeout(goNext, 650);
  }

  if (words.length === 0) {
    return (
      <section className="candy-shell py-8">
        <CandyCard className="bg-slate-50 p-8 text-center">
          <p className="text-2xl font-black text-slate-950">{level.label} 暂未开放</p>
          <p className="mt-2 text-sm font-bold text-slate-400">这个级别的单词整理好后，就可以开始背单词。</p>
        </CandyCard>
      </section>
    );
  }

  return (
    <section className="candy-shell py-8">
      <CandyCard className="overflow-hidden bg-[#F8FBEE] p-5 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black text-[#FF7EB6]">Practice</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">{level.label} 背单词</h1>
            <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-500">
              输入完整英文单词，按空格键确认。正确后会自动进入下一个随机单词。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-[22px] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-black text-slate-400">词库</p>
              <p className="mt-1 text-3xl font-black text-slate-950">{words.length.toLocaleString()}</p>
            </div>
            <div className="rounded-[22px] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm font-black text-slate-400">已答对</p>
              <p className="mt-1 text-3xl font-black text-[#157A33]">{correctCount}</p>
            </div>
          </div>
        </div>
      </CandyCard>

      <CandyCard
        className={`mt-6 p-5 transition sm:p-8 ${
          checkState === "correct"
            ? "bg-[#ECFFF0] ring-2 ring-[#7AE582]"
            : checkState === "wrong"
              ? "bg-[#FFF3F8] ring-2 ring-[#FF7EB6]"
              : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black text-slate-400">中文提示</p>
          <p className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
            {currentWord.meaning ?? currentWord.definition ?? currentWord.headword}
          </p>

          {currentWord.definition ? (
            <p className="mt-5 rounded-[22px] bg-[#FFF9F2] px-5 py-4 text-base font-bold leading-7 text-slate-600">
              {currentWord.definition}
            </p>
          ) : null}

          <div className="mt-8 rounded-[24px] bg-slate-950 px-5 py-5 font-serif text-4xl font-black tracking-normal text-white sm:text-6xl">
            {maskedWord}
          </div>

          <input
            className={`mt-6 min-h-14 w-full rounded-full border px-6 text-center text-xl font-black outline-none transition sm:text-2xl ${
              checkState === "correct"
                ? "border-[#7AE582] bg-white text-[#157A33] ring-4 ring-[#7AE582]/20"
                : checkState === "wrong"
                  ? "border-[#FF7EB6] bg-white text-[#B52B70] ring-4 ring-[#FF7EB6]/20"
                  : "border-slate-200 bg-white text-slate-950 focus:border-[#FF7EB6] focus:ring-4 focus:ring-[#FF7EB6]/15"
            }`}
            placeholder="输入英文单词，按空格确认"
            value={answer}
            autoFocus
            onChange={(event) => {
              setAnswer(event.target.value);
              if (checkState !== "correct") {
                setCheckState("idle");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === " ") {
                event.preventDefault();
                checkAnswer();
              }
            }}
          />

          {checkState !== "idle" ? (
            <div
              className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black ${
                checkState === "correct" ? "bg-[#7AE582] text-slate-950" : "bg-[#FF7EB6] text-white"
              }`}
            >
              {checkState === "correct" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {checkState === "correct" ? "正确，进入下一个..." : "不对，再改一下"}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <CandyButton onClick={checkAnswer} disabled={!answer.trim() || checkState === "correct"}>
              确认
            </CandyButton>
            <CandyButton tone="plain" onClick={goNext}>
              <RotateCcw size={18} />
              换一个
            </CandyButton>
          </div>
        </div>
      </CandyCard>
    </section>
  );
}
