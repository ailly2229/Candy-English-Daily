import { type ButtonHTMLAttributes } from "react";

type CandyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "pink" | "blue" | "mint" | "plain";
};

const tones = {
  pink: "bg-[#FF7EB6] text-white shadow-[0_10px_24px_rgba(255,126,182,0.28)]",
  blue: "bg-[#6EC6FF] text-slate-900 shadow-[0_10px_24px_rgba(110,198,255,0.28)]",
  mint: "bg-[#7AE582] text-slate-900 shadow-[0_10px_24px_rgba(122,229,130,0.28)]",
  plain: "bg-white text-slate-700 border border-slate-200"
};

export function CandyButton({ className = "", tone = "pink", ...props }: CandyButtonProps) {
  return (
    <button
      className={`candy-button inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
      {...props}
    />
  );
}
