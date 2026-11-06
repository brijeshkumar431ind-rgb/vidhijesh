"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, BookMarked, Gavel, Search, ShieldCheck } from "lucide-react";
import { research } from "@/lib/research";
import { useAppStore } from "@/lib/store";
import { translate } from "@/lib/i18n";

export default function HomePage() {
  const router = useRouter();
  const { language, name, practice, queryCount, lastQueryDate, incrementQuery, setCurrentResult } = useAppStore();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const isToday = lastQueryDate === new Date().toISOString().slice(0, 10);
  const used = isToday ? queryCount : 0;

  async function runResearch(value = query) {
    if (!value.trim() || loading) return;
    if (!incrementQuery()) return;
    setLoading(true);
    const result = await research(value, language);
    setCurrentResult(result);
    router.replace("/results");
  }

  const chips = [
    { label: translate(language, "bail"), icon: Gavel, value: "Find anticipatory bail authorities and conditions" },
    { label: translate(language, "sectionLookup"), icon: BookMarked, value: "Find the applicability of Sections 482 and 483 BNSS" },
    { label: translate(language, "precedent"), icon: Search, value: "Find Supreme Court bail precedents" },
  ];

  return <main className="min-h-[calc(100vh-4rem)] bg-[#f4f6f8] px-4 py-10 pb-24 md:px-10 md:py-14"><div className="mx-auto max-w-5xl">
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 flex items-center gap-2"><span className="h-px w-8 bg-[#f59e0b]"/><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b45309]">{practice ? `${practice} ${translate(language, "litigation")}` : translate(language, "litigation")}</p></div><h1 className="font-serif text-4xl font-bold leading-tight text-[#0f172a] md:text-5xl">{translate(language, "welcome")}, {name || "Advocate"}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{language === "hi" ? "आज किस कानूनी विषय पर शोध करना है, वह नीचे लिखें।" : "Bring the facts. We’ll organise the law, authorities and next steps."}</p></div><div className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 shadow-sm"><span className="text-sm font-bold text-[#0f172a]">{used} / 20</span><span className="h-4 w-px bg-slate-200"/><span className="text-[11px] font-medium text-slate-500">{translate(language, "queriesToday")}</span></div></div>
    {used >= 20 && <div className="mb-5 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">{translate(language, "upgrade")}</div>}
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,.10)]"><div className="h-1.5 bg-[#f59e0b]"/><div className="p-5 md:p-8"><label htmlFor="research-query" className="block font-serif text-2xl font-bold text-[#0f172a] md:text-3xl">{translate(language, "researchPrompt")}</label><div className="mt-5 rounded-lg border border-slate-300 bg-white p-2 shadow-sm focus-within:border-[#f59e0b] focus-within:ring-4 focus-within:ring-[#f59e0b]/10"><textarea id="research-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={translate(language, "researchPlaceholder")} className="min-h-36 w-full resize-none rounded-md border-0 px-3 py-3 text-base leading-7 text-slate-900 outline-none placeholder:text-slate-400 md:min-h-40" /><div className="flex justify-end px-1 pb-1"><button onClick={() => runResearch()} disabled={!query.trim() || loading || used >= 20} className="flex h-11 items-center gap-2 rounded-md bg-[#f59e0b] px-5 text-sm font-bold text-[#0f172a] shadow-sm hover:bg-[#e6a008] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"><Search size={17}/>{loading ? translate(language, "retrieving") : "Search"}</button></div></div></div></section>
    <div className="mt-6"><p className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-slate-400">{language === "hi" ? "त्वरित खोज" : "Quick research"}</p><div className="flex flex-wrap gap-3">{chips.map(({ label, icon: Icon, value }) => <button key={label} onClick={() => runResearch(value)} disabled={used >= 20} className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#f59e0b] hover:bg-amber-50 hover:text-[#0f172a] disabled:opacity-50"><Icon size={16}/>{label}</button>)}</div></div>
    <div className="mt-9 grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#b45309]">{translate(language, "retrieval")}</p><p className="mt-2 text-sm font-semibold">{translate(language, "retrievalDetail")}</p></div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#b45309]">{translate(language, "precedent")}</p><p className="mt-2 text-sm font-semibold">{translate(language, "precedentDetail")}</p></div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#b45309]">{translate(language, "privacy")}</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={15}/>{translate(language, "privacyDetail")}</p></div></div>
  </div></main>;
}
