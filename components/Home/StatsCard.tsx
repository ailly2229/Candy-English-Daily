"use client";

import { motion } from "framer-motion";
import { BarChart3, Flame, Target } from "lucide-react";
import { CandyCard } from "@/components/UI/CandyCard";
import { useProgress } from "@/context/ProgressContext";

const fallback = {
  streak: 12,
  completedCount: 36,
  averageScore: 84
};

export function StatsCard() {
  const { getStats } = useProgress();
  const stats = getStats();
  const visibleStats =
    stats.completedCount === 0
      ? {
          ...fallback,
          isDemo: true
        }
      : {
          ...stats,
          isDemo: false
        };

  const items = [
    { label: "连续学习", value: `${visibleStats.streak}天`, Icon: Flame, color: "#FF7EB6" },
    { label: "完成文章", value: `${visibleStats.completedCount}篇`, Icon: BarChart3, color: "#6EC6FF" },
    { label: "平均正确率", value: `${visibleStats.averageScore}%`, Icon: Target, color: "#7AE582" }
  ];

  return (
    <section className="py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black text-[#FF7EB6]">Learning Stats</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">学习统计</h2>
        </div>
        {visibleStats.isDemo ? <p className="text-xs font-bold text-slate-400">示例数据</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(({ label, value, Icon, color }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <CandyCard className="p-5">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-slate-50">
                <Icon color={color} size={24} />
              </div>
              <p className="text-sm font-bold text-slate-400">{label}</p>
              <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
            </CandyCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
