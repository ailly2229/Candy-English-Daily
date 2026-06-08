"use client";

import { motion } from "framer-motion";
import { BookOpen, Cloud, Headphones, Music2, Pencil } from "lucide-react";

const items = [
  { Icon: Cloud, color: "#6EC6FF", x: "8%", y: "12%", delay: 0 },
  { Icon: Headphones, color: "#FF7EB6", x: "75%", y: "8%", delay: 0.4 },
  { Icon: BookOpen, color: "#7AE582", x: "14%", y: "68%", delay: 0.8 },
  { Icon: Pencil, color: "#FFC971", x: "82%", y: "64%", delay: 1.2 },
  { Icon: Music2, color: "#BFA2FF", x: "48%", y: "28%", delay: 1.6 }
];

export function FloatingIllustration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map(({ Icon, color, x, y, delay }) => (
        <motion.div
          key={`${x}-${y}`}
          className="absolute grid h-14 w-14 place-items-center rounded-full bg-white shadow-lg"
          style={{ left: x, top: y }}
          animate={{ y: [0, -12, 0], rotate: [-2, 4, -2] }}
          transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
        >
          <Icon color={color} size={28} strokeWidth={2.4} />
        </motion.div>
      ))}
    </div>
  );
}
