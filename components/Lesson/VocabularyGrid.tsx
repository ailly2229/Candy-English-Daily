"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import type { VocabularyItem } from "@/lib/lessons";

const candyStyles = [
  {
    front: "from-[#FFE3F1] to-[#FFB7D9]",
    back: "from-[#FFF7CC] to-[#FFC971]",
    ink: "text-[#B52B70]"
  },
  {
    front: "from-[#DFF5FF] to-[#A9E2FF]",
    back: "from-[#EAF8FF] to-[#BFA2FF]",
    ink: "text-[#1779AE]"
  },
  {
    front: "from-[#E8FFE9] to-[#B7F7BE]",
    back: "from-[#F2ECFF] to-[#D8CAFF]",
    ink: "text-[#218C3C]"
  },
  {
    front: "from-[#FFF3D9] to-[#FFD48A]",
    back: "from-[#FFE4EF] to-[#FF9DCA]",
    ink: "text-[#A66000]"
  }
];

export function VocabularyGrid({ vocabulary, showAll = false }: { vocabulary: VocabularyItem[]; showAll?: boolean }) {
  const visibleVocabulary = showAll ? vocabulary : vocabulary.slice(0, 8);

  return (
    <section className="py-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#ECFFF0] text-[#1B9B45]">
          <BookOpen size={22} />
        </span>
        <h2 className="text-2xl font-black text-slate-950">Vocabulary</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleVocabulary.map((item, index) => {
          const style = candyStyles[index % candyStyles.length];

          return (
          <motion.div
            key={item.word}
            className="group h-56 [perspective:1000px]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -6, rotate: index % 2 === 0 ? 1.2 : -1.2 }}
          >
            <div className="relative h-full rounded-[24px] transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div
                className={`absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-br ${style.front} p-5 text-center shadow-[0_18px_40px_rgba(31,41,55,0.10)] [backface-visibility:hidden]`}
              >
                <div className="flex justify-end">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-white/70">
                    <Sparkles size={18} className={style.ink} />
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-black leading-tight ${style.ink}`}>{item.word}</p>
                  {item.phonetic ? (
                    <p className="mt-2 text-sm font-black text-slate-500">{item.phonetic}</p>
                  ) : null}
                </div>
                <span className="mx-auto h-2 w-16 rounded-full bg-white/70" aria-hidden="true" />
              </div>
              <div
                className={`absolute inset-0 flex flex-col justify-center rounded-[24px] bg-gradient-to-br ${style.back} p-5 text-center shadow-[0_18px_40px_rgba(31,41,55,0.10)] [backface-visibility:hidden] [transform:rotateY(180deg)]`}
              >
                <p className="text-xl font-black text-slate-950">{item.meaning}</p>
                <p className="mt-4 text-sm leading-6 text-slate-700">{item.example}</p>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </section>
  );
}
