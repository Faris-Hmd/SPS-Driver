"use client";

import { usePathname } from "next/navigation";
import { Home, History, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const NAV_ITEMS = [
  { title: "Home", href: "/", icon: Home },
  { title: "History", href: "/history", icon: History },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl py-3 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Left Side: Brand & Two Main Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Logo className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                SUDAN<span className="text-blue-600">PC</span>
              </span>
              <span className="text-[9px] font-black text-blue-600/80 uppercase tracking-[0.2em] mt-0.5">
                Driver
              </span>
            </div>
          </Link>

          {/* Minimal Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href as any}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isActive
                      ? "text-blue-600 bg-white dark:bg-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                  }`}
                >
                  <Icon size={14} strokeWidth={isActive ? 3 : 2} />
                  <span className="hidden xs:block">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Theme & Profile */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {session?.user ? (
            <Link
              href="/profile"
              className="active:scale-90 transition-transform"
            >
              <Avatar className="h-9 w-9 overflow-hidden rounded-xl border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                <AvatarImage
                  src={session.user?.image || ""}
                  className="object-cover h-full w-full"
                />
                <AvatarFallback className="text-[10px] font-black text-blue-600 uppercase">
                  {session.user?.name?.substring(0, 2) || "DR"}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="group flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-700 transition-all active:scale-95"
            >
              <LogIn size={14} />
              LOGIN
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
