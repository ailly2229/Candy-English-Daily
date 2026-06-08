import Link from "next/link";
import { Candy } from "lucide-react";
import { LoginButton } from "@/components/Layout/LoginButton";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/82 backdrop-blur-xl">
      <nav className="candy-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-black text-slate-900">
          <span className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#FF7EB6] via-[#FF9DCA] to-[#FFC971] text-white shadow-[0_12px_28px_rgba(255,126,182,0.32)]">
            <span className="absolute -right-1 top-1 h-3 w-3 rounded-full bg-[#6EC6FF] ring-2 ring-white" />
            <span className="absolute bottom-1 left-0 h-2.5 w-2.5 rounded-full bg-[#7AE582] ring-2 ring-white" />
            <Candy size={27} strokeWidth={2.8} />
          </span>
          <span className="leading-tight text-slate-950">
            Candy English
            <span className="block text-sm font-bold text-slate-500">Daily</span>
          </span>
        </Link>

        <LoginButton />
      </nav>
    </header>
  );
}
