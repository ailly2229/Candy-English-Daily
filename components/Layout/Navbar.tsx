import Link from "next/link";
import { Candy, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/82 backdrop-blur-xl">
      <nav className="candy-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-black text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FF7EB6] text-white shadow-lg">
            <Candy size={22} />
          </span>
          <span className="leading-tight">
            Candy
            <span className="block text-sm font-bold text-slate-500">English Daily</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm">
          <Sparkles size={16} color="#FFC971" />
          Daily BBC
        </div>
      </nav>
    </header>
  );
}
