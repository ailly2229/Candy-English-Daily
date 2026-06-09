import Link from "next/link";
import { ArrowRight, Pocket, Sparkles } from "lucide-react";
import { CandyCard } from "@/components/UI/CandyCard";
import { formatLessonDate } from "@/lib/format";
import type { PocketEnglishItem } from "@/lib/pocketEnglish";

export function PocketEnglish({ items }: { items: PocketEnglishItem[] }) {
  return (
    <section className="py-10">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#FF7EB6]">Pocket English</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Pocket English 口袋英语</h2>
        </div>
        <Link
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-[#FF4D9A]"
          href="/pocket-english"
        >
          <Pocket size={16} />
          查看全部
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <Link key={item.id} href={`/pocket-english/${item.slug}`} className="block">
            <CandyCard className="h-full p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(31,41,55,0.12)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#FFF3F8] text-[#FF4D9A]">
                  <Sparkles size={19} />
                </span>
                <span className="rounded-full bg-[#ECFFF0] px-3 py-1 text-xs font-black text-[#157A33]">BBC 随身英语</span>
              </div>
              <p className="text-xs font-black text-slate-400">{formatLessonDate(item.date)}</p>
              <h3 className="mt-2 line-clamp-3 text-base font-black leading-6 text-slate-950">{item.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm font-bold leading-6 text-slate-500">{item.summary}</p>
            </CandyCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
