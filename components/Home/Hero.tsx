"use client";

import { motion } from "framer-motion";
import { FloatingIllustration } from "@/components/UI/FloatingIllustration";

export function Hero() {
  return (
    <section className="relative min-h-[260px] overflow-hidden py-12 sm:py-16">
      <FloatingIllustration />
      <div className="relative mx-auto max-w-3xl text-center">
        <motion.p
          className="mx-auto mb-4 inline-flex rounded-full bg-[#FFF3F8] px-4 py-2 text-sm font-black text-[#FF4D9A]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          English Listening & Speaking for Daily Life
        </motion.p>
        <motion.h1
          className="text-4xl font-black tracking-normal text-slate-950 sm:text-6xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          今日学习任务
        </motion.h1>
        <motion.p
          className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-500 sm:text-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          每天完成听力、阅读、词汇训练。
        </motion.p>
      </div>
    </section>
  );
}
