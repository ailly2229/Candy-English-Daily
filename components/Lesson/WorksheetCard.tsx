"use client";

import { Download, FileCheck2 } from "lucide-react";
import { CandyCard } from "@/components/UI/CandyCard";

export function WorksheetCard({ worksheet }: { worksheet?: string }) {
  if (!worksheet) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FFF7E6] text-[#B46D00]">
          <FileCheck2 size={22} />
        </span>
        <h2 className="text-2xl font-black text-slate-950">Worksheet</h2>
      </div>

      <CandyCard className="overflow-hidden bg-gradient-to-br from-[#FFF7E6] to-[#FFE6F1] p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-[#B46D00]">BBC Learning English</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">练习表</h3>
          </div>

          <a
            className="candy-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FF7EB6] px-5 py-3 text-sm font-black text-white shadow-[0_10px_24px_rgba(255,126,182,0.28)]"
            href={worksheet}
            rel="noreferrer"
            target="_blank"
          >
            打开练习表
            <Download size={18} />
          </a>
        </div>
      </CandyCard>
    </section>
  );
}
