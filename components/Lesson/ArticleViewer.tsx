"use client";

import { useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { CandyButton } from "@/components/UI/CandyButton";
import { CandyCard } from "@/components/UI/CandyCard";

export function ArticleViewer({ content, pageUrl }: { content: string; pageUrl?: string }) {
  const [visible, setVisible] = useState(true);
  const transcriptLines = content.split(/\n+/).map((item) => item.trim()).filter(Boolean);

  return (
    <section className="py-8">
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
        <CandyCard className="mx-auto max-w-[800px] p-6 sm:p-8">
          <div className="space-y-4 text-base leading-[1.9] text-slate-700 sm:text-lg">
            {transcriptLines.map((line, index) => (
              <p
                key={`${line}-${index}`}
                className={
                  /^[A-Z][A-Za-z\s'-]{1,24}$/.test(line)
                    ? "pt-3 text-base font-black leading-6 text-[#FF4D9A]"
                    : ""
                }
              >
                {line}
              </p>
            ))}
          </div>
        </CandyCard>
      ) : null}
    </section>
  );
}
