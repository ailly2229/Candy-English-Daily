import Link from "next/link";
import { ArrowLeft, Headphones, Sparkles } from "lucide-react";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { CandyCard } from "@/components/UI/CandyCard";
import { CandyLink } from "@/components/UI/CandyLink";
import { formatLessonDate } from "@/lib/format";
import { getRecentPocketEnglishItems } from "@/lib/pocketEnglish";

export default function PocketEnglishPage() {
  const items = getRecentPocketEnglishItems();

  return (
    <>
      <Navbar />
      <main className="candy-shell py-8">
        <CandyLink href="/" tone="plain">
          <ArrowLeft size={18} />
          返回首页
        </CandyLink>

        <section className="py-8">
          <p className="text-sm font-black text-[#FF7EB6]">BBC 随身英语</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">Pocket English 口袋英语</h1>
          <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-500">
            最近 6 个月的随身英语音频、词汇表和原文。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/pocket-english/${item.slug}`} className="block">
              <CandyCard className="h-full p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(31,41,55,0.12)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#FFF3F8] text-[#FF4D9A]">
                    <Headphones size={19} />
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-[#ECFFF0] px-3 py-1 text-xs font-black text-[#157A33]">
                    <Sparkles size={13} />
                    Pocket
                  </span>
                </div>
                <p className="text-xs font-black text-slate-400">{formatLessonDate(item.date)}</p>
                <h2 className="mt-2 text-lg font-black leading-7 text-slate-950">{item.title}</h2>
                <p className="mt-3 line-clamp-2 text-sm font-bold leading-6 text-slate-500">{item.summary}</p>
              </CandyCard>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
