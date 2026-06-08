"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, UserRound, X } from "lucide-react";
import {
  AUTH_CHANGE_EVENT,
  AUTH_COOKIE_KEY,
  AUTH_PASSWORD,
  AUTH_STORAGE_KEY,
  AUTH_USERS,
  isAuthUser,
  type AuthUser
} from "@/lib/auth";

function readCurrentUser() {
  if (typeof window === "undefined") return null;
  const saved =
    window.localStorage.getItem(AUTH_STORAGE_KEY) ??
    document.cookie
      .split("; ")
      .find((item) => item.startsWith(`${AUTH_COOKIE_KEY}=`))
      ?.split("=")[1];

  return saved && isAuthUser(saved) ? saved : null;
}

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function LoginButton() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<AuthUser>("Ally");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUser(readCurrentUser());

    function syncUser() {
      setUser(readCurrentUser());
    }

    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  function login() {
    if (password !== AUTH_PASSWORD) {
      setError("密码不正确");
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, selectedUser);
    document.cookie = `${AUTH_COOKIE_KEY}=${selectedUser}; path=/; max-age=31536000; SameSite=Lax`;
    setUser(selectedUser);
    setPassword("");
    setError("");
    setOpen(false);
    notifyAuthChange();
  }

  function logout() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    setUser(null);
    notifyAuthChange();
  }

  return (
    <>
      <button
        className="flex min-h-11 items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        type="button"
        onClick={() => setOpen(true)}
      >
        <UserRound size={17} color="#FF7EB6" />
        {user ?? "登录"}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/25 px-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-[0_24px_70px_rgba(31,41,55,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-[#FF7EB6]">Account</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">登录</h2>
              </div>
              <button
                className="grid h-10 w-10 place-items-center rounded-full bg-slate-50 text-slate-500"
                type="button"
                aria-label="关闭登录"
                onClick={() => setOpen(false)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {AUTH_USERS.map((item) => (
                <button
                  key={item}
                  className={`min-h-11 rounded-full px-4 text-sm font-black transition ${
                    selectedUser === item ? "bg-[#ECFFF0] text-[#157A33]" : "bg-slate-50 text-slate-500"
                  }`}
                  type="button"
                  onClick={() => {
                    setSelectedUser(item);
                    setError("");
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            <input
              className="mt-5 min-h-12 w-full rounded-full border border-slate-200 px-5 text-base font-bold outline-none transition focus:border-[#FF7EB6] focus:ring-4 focus:ring-[#FF7EB6]/15"
              placeholder="密码"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  login();
                }
              }}
            />

            {error ? <p className="mt-3 text-sm font-black text-[#B52B70]">{error}</p> : null}

            <div className="mt-5 flex gap-3">
              <button
                className="candy-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#FF7EB6] px-5 py-2.5 text-sm font-black text-white"
                type="button"
                onClick={login}
              >
                <LogIn size={17} />
                登录
              </button>
              {user ? (
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-600"
                  type="button"
                  onClick={logout}
                >
                  <LogOut size={17} />
                  退出
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
