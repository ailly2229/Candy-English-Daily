"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { VocabularyItem } from "@/lib/lessons";

export function VocabularyGrid({ vocabulary }: { vocabulary: VocabularyItem[] }) {
  return (
    <section className="py-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#ECFFF0] text-[#1B9B45]">
          <BookOpen size={22} />
        </span>
        <h2 className="text-2xl font-black text-slate-950">Vocabulary</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {vocabulary.map((item, index) => (
          <motion.div
            key={item.word}
            className="group h-44 [perspective:1000px]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
          >
            <div className="relative h-full rounded-[24px] transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 flex flex-col justify-center rounded-[24px] border border-slate-100 bg-white p-5 text-center shadow-lg [backface-visibility:hidden]">
                <p className="text-2xl font-black text-slate-950">{item.word}</p>
                <p className="mt-3 text-lg font-bold text-[#FF7EB6]">{item.meaning}</p>
              </div>
              <div className="absolute inset-0 flex flex-col justify-center rounded-[24px] bg-[#F6F2FF] p-5 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-sm font-black text-[#7C5DDB]">{item.phonetic}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.example}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
