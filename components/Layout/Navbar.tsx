import Link from "next/link";
import { InstallIphoneButton } from "@/components/Layout/InstallIphoneButton";
import { LoginButton } from "@/components/Layout/LoginButton";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/82 backdrop-blur-xl">
      <nav className="candy-shell flex h-16 items-center justify-between">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3 font-black text-slate-900">
            <img
              className="h-12 w-12 shrink-0 rounded-[14px] object-cover shadow-[0_12px_28px_rgba(255,126,182,0.28)]"
              src="/icons/apple-touch-icon.png"
              alt="Candy English logo"
            />
            <span className="hidden leading-tight text-slate-950 sm:block">
              Candy English
              <span className="block text-sm font-bold text-slate-500">Daily</span>
            </span>
          </Link>
          <InstallIphoneButton />
        </div>

        <LoginButton />
      </nav>
    </header>
  );
}
