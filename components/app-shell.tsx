"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BookOpenText, FileText, FolderOpen, Search, Settings } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { translate } from "@/lib/i18n";

const links = [
  { href: "/home", icon: Search, label: "research" },
  { href: "/case-law", icon: BookOpenText, label: "caseLaw" },
  { href: "/draft-note", icon: FileText, label: "draftNote" },
  { href: "/documents", icon: FolderOpen, label: "documents" },
  { href: "/settings", icon: Settings, label: "settings" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { practice, language, name } = useAppStore();

  useEffect(() => {
    if (!practice) router.replace("/onboarding");
  }, [practice, router]);

  if (pathname === "/onboarding") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f2f4f7] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0f172a] text-white md:flex">
        <Link href="/home" className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-[#f59e0b] font-serif text-sm font-bold text-[#0f172a]">JV</div>
          <div><div className="font-serif text-xl font-bold">{translate(language, "appName")}</div><div className="text-[9px] uppercase tracking-[0.22em] text-slate-400">Legal Research</div></div>
        </Link>
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return <Link key={href} href={href} className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-colors ${active ? "bg-white text-[#0f172a] shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon size={18} className={active ? "text-[#d97706]" : ""}/><span>{translate(language, label)}</span></Link>;
          })}
        </nav>
        <div className="mx-3 mb-4 flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#f59e0b] text-sm font-bold text-[#0f172a]">{name ? name.charAt(0).toUpperCase() : "A"}</div><div className="min-w-0"><div className="truncate text-sm font-semibold">{name || "Advocate"}</div><div className="mt-0.5 truncate text-xs text-slate-400">{practice} Practice</div></div></div>
      </aside>
      <main className="md:ml-64"><header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8"><Link href="/home" className="font-serif text-lg font-bold text-[#0f172a] md:hidden">JeshVidhi</Link><div className="hidden items-center gap-2 text-sm text-slate-500 md:flex"><span className="h-2 w-2 rounded-full bg-[#f59e0b]"/> {practice ? `${practice} Litigation Workspace` : "Legal Research Workspace"}</div><div className="grid h-9 w-9 place-items-center rounded-full bg-[#0f172a] text-xs font-bold text-white ring-4 ring-slate-100">{name ? name.charAt(0).toUpperCase() : "A"}</div></header>{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white px-1 py-2 shadow-[0_-6px_20px_rgba(15,23,42,.08)] md:hidden">
        {links.map(({ href, icon: Icon, label }) => <Link key={href} href={href} className={`flex flex-col items-center gap-1 py-1 text-[10px] ${pathname === href ? "font-semibold text-[#0f172a]" : "text-slate-500"}`}><Icon size={19}/><span>{translate(language, label)}</span></Link>)}
      </nav>
    </div>
  );
}
