"use client";

import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

export function ResultCard({ score }: { score: number }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-[24px] bg-slate-950 p-7 text-center text-white shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: `${10 + ((index * 7) % 82)}%`,
            top: `${12 + ((index * 11) % 70)}%`,
            background: ["#FF7EB6", "#6EC6FF", "#7AE582", "#FFC971", "#BFA2FF"][index % 5]
          }}
          animate={{ y: [0, -16, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.08 }}
        />
      ))}
      <div className="relative">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white text-[#FF7EB6]">
          <PartyPopper size={30} />
        </div>
        <p className="text-3xl font-black">Great Job!</p>
        <p className="mt-3 text-sm font-bold text-white/70">本次正确率</p>
        <p className="mt-1 text-5xl font-black text-[#7AE582]">{score}%</p>
      </div>
    </motion.div>
  );
}
