"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Mic2, Volume2 } from "lucide-react";
import { CandyButton } from "@/components/UI/CandyButton";
import { CandyCard } from "@/components/UI/CandyCard";
import { useProgress } from "@/context/ProgressContext";
import { scoreDictation } from "@/lib/dictation";
import { ResultCard } from "@/components/Lesson/ResultCard";

export function DictationTrainer({
  lessonId,
  sentences,
  startedAt
}: {
  lessonId: string;
  sentences: string[];
  startedAt: number;
}) {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof scoreDictation> | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const { saveProgress } = useProgress();
  const currentSentence = sentences[sentenceIndex] ?? "";

  const canGoNext = useMemo(() => result !== null && sentenceIndex < sentences.length - 1, [result, sentenceIndex, sentences.length]);

  function checkAnswer() {
    const nextResult = scoreDictation(currentSentence, input);
    const nextScores = [...scores.slice(0, sentenceIndex), nextResult.score];
    setResult(nextResult);
    setScores(nextScores);

    if (sentenceIndex === sentences.length - 1) {
      const averageScore = Math.round(
        nextScores.reduce((sum, score) => sum + score, 0) / Math.max(1, nextScores.length)
      );
      const timeSpent = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
      setFinalScore(averageScore);
      saveProgress(lessonId, averageScore, timeSpent);
    }
  }

  function nextSentence() {
    setSentenceIndex((current) => current + 1);
    setInput("");
    setResult(null);
  }

  function playSentence() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section className="py-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FFF7E6] text-[#B46D00]">
          <Mic2 size={22} />
        </span>
        <h2 className="text-2xl font-black text-slate-950">Dictation</h2>
      </div>

      <CandyCard className="p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black text-slate-400">
            Sentence {sentenceIndex + 1} / {sentences.length}
          </p>
          <CandyButton tone="blue" onClick={playSentence}>
            <Volume2 size={18} />
            播放一句
          </CandyButton>
        </div>

        <textarea
          className="min-h-36 w-full resize-y rounded-[24px] border border-slate-200 bg-white p-5 text-base leading-7 outline-none transition focus:border-[#FF7EB6] focus:ring-4 focus:ring-[#FF7EB6]/15"
          placeholder="听完后，把这一句写在这里..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <CandyButton onClick={checkAnswer} disabled={!input.trim()}>
            <CheckCircle2 size={18} />
            检查答案
          </CandyButton>
          {canGoNext ? (
            <CandyButton tone="mint" onClick={nextSentence}>
              下一句
            </CandyButton>
          ) : null}
        </div>

        {result ? (
          <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
            <p className="text-sm font-black text-slate-400">正确率</p>
            <p className="mt-1 text-4xl font-black text-slate-950">{result.score}%</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.compared.map((item, index) => (
                <span
                  key={`${item.word}-${index}`}
                  className={`rounded-full px-3 py-1 text-sm font-black ${
                    item.status === "correct"
                      ? "bg-[#7AE582]/25 text-[#157A33]"
                      : item.status === "missing"
                        ? "bg-[#FFC971]/30 text-[#9A5A00]"
                        : "bg-[#FF7EB6]/22 text-[#B52B70]"
                  }`}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </CandyCard>

      {finalScore !== null ? (
        <div className="mt-6">
          <ResultCard score={finalScore} />
        </div>
      ) : null}
    </section>
  );
}
