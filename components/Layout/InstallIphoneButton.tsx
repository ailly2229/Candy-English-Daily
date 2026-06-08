"use client";

import { useEffect, useState } from "react";
import { Download, PlusSquare, Share, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

export function InstallIphoneButton() {
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const iosNavigator = navigator as Navigator & { standalone?: boolean };
    setInstalled(window.matchMedia("(display-mode: standalone)").matches || Boolean(iosNavigator.standalone));

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  async function install() {
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
      return;
    }

    setOpen(true);
  }

  return (
    <>
      <button
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:text-sm"
        type="button"
        onClick={install}
      >
        <Download size={16} color="#FF7EB6" />
        <span>安装</span>
        <span className="hidden sm:inline">到 iPhone</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/25 px-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-[0_24px_70px_rgba(31,41,55,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  className="h-14 w-14 rounded-[18px] shadow-sm"
                  src="/icons/apple-touch-icon.png"
                  alt="Candy English icon"
                />
                <div>
                  <p className="text-sm font-black text-[#FF7EB6]">iPhone</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    {installed ? "已安装" : "添加到主屏幕"}
                  </h2>
                </div>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-50 text-slate-500"
                type="button"
                aria-label="关闭安装说明"
                onClick={() => setOpen(false)}
              >
                <X size={19} />
              </button>
            </div>

            {installed ? (
              <p className="mt-5 rounded-[20px] bg-[#ECFFF0] p-4 text-sm font-black leading-6 text-[#157A33]">
                你正在用主屏幕图标打开 Candy English。
              </p>
            ) : (
              <div className="mt-5 space-y-3 text-sm font-bold leading-6 text-slate-600">
                <div className="flex gap-3 rounded-[20px] bg-slate-50 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#0B7CFF] shadow-sm">
                    <Share size={18} />
                  </span>
                  <p>在 iPhone Safari 打开本网站，点击底部的分享按钮。</p>
                </div>
                <div className="flex gap-3 rounded-[20px] bg-slate-50 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#157A33] shadow-sm">
                    <PlusSquare size={18} />
                  </span>
                  <p>选择“添加到主屏幕”，再点“添加”。桌面图标会显示这个糖果 logo。</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
