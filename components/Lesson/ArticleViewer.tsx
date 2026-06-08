"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { CandyButton } from "@/components/UI/CandyButton";
import { CandyCard } from "@/components/UI/CandyCard";

export function ArticleViewer({ content }: { content: string }) {
  const [visible, setVisible] = useState(true);

  return (
    <section className="py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF8FF] text-[#2183BD]">
            <FileText size={22} />
          </span>
          <h2 className="text-2xl font-black text-slate-950">Article</h2>
        </div>
        <CandyButton tone="plain" onClick={() => setVisible((current) => !current)}>
          {visible ? "隐藏原文" : "显示原文"}
        </CandyButton>
      </div>

      {visible ? (
        <CandyCard className="mx-auto max-w-[800px] p-6 sm:p-8">
          <p className="text-base leading-[1.9] text-slate-700 sm:text-lg">{content}</p>
        </CandyCard>
      ) : null}
    </section>
  );
}
