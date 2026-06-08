import { ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { CandyCard } from "@/components/UI/CandyCard";
import { CandyLink } from "@/components/UI/CandyLink";
import type { WordbookLevel } from "@/lib/wordbook";

type WordbookSummary = WordbookLevel & { count: number };

export function WordbookTrainer({ levels }: { levels: WordbookSummary[] }) {
  return (
    <section className="py-10">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#7AE582]">Wordbook</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">单词本</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-500 shadow-sm">
          <Layers3 size={16} />
          CEFR + Academic&NGO
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map((level) => {
          const available = level.count > 0;

          return (
            <CandyCard
              key={level.slug}
              className={`overflow-hidden p-5 transition ${
                available
                  ? "group hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(31,41,55,0.12)]"
                  : "bg-slate-50/80 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={`grid h-14 w-14 place-items-center rounded-[20px] text-lg font-black ${
                    level.slug === "c2" ? "bg-slate-950 text-white" : `${level.accent} text-slate-950`
                  }`}
                >
                  {level.label === "Academic&NGO" ? <BookOpen size={24} /> : level.label}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-500">
                  {available ? `${level.count.toLocaleString()} words` : "待整理"}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-950">{level.label}</h3>
              <p className="mt-2 min-h-12 text-sm font-bold leading-6 text-slate-500">
                {available ? level.description : "这个级别的单词本稍后添加。"}
              </p>

              {available ? (
                <CandyLink className="mt-5 w-full" href={`/wordbook/${level.slug}`} tone="plain">
                  打开词表
                  <ArrowRight size={17} />
                </CandyLink>
              ) : (
                <button
                  className="mt-5 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-300"
                  type="button"
                  disabled
                >
                  暂未开放
                </button>
              )}
            </CandyCard>
          );
        })}
      </div>
    </section>
  );
}
