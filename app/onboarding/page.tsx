"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  HeartHandshake,
  Landmark,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PracticeType, Language } from "@/lib/types";
import { useAppStore } from "@/lib/store";

const practices: { name: PracticeType; description: string; icon: typeof Scale }[] = [
  { name: "Criminal", description: "Bail, trials & appeals", icon: Scale },
  { name: "Civil", description: "Disputes & recovery", icon: Landmark },
  { name: "Corporate", description: "Contracts & compliance", icon: Building2 },
  { name: "Tax", description: "Returns & tribunals", icon: BriefcaseBusiness },
  { name: "Family", description: "Marriage & custody", icon: HeartHandshake },
];

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useAppStore((state) => state.setProfile);
  const [name, setName] = useState("");
  const [practice, setPractice] = useState<PracticeType>("Criminal");
  const [language, setLanguage] = useState<Language>("en");

  return (
    <main className="min-h-screen bg-[#e8edf3] lg:grid lg:grid-cols-[minmax(360px,43%)_1fr]">
      <aside className="relative hidden overflow-hidden bg-[#0f172a] px-12 py-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[#17243d] opacity-70" />
        <div className="relative flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-md bg-[#f59e0b] text-[#0f172a] shadow-lg"><Scale size={23} strokeWidth={2.2} /></div><div><div className="font-serif text-2xl font-bold">JeshVidhi</div><div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Legal research</div></div></div>
        <div className="relative my-auto max-w-md"><div className="mb-7 h-px w-14 bg-[#f59e0b]" /><blockquote className="font-serif text-4xl leading-[1.18] xl:text-5xl">Research the law.<br /><span className="text-slate-300">Protect the advocate&apos;s time.</span></blockquote><p className="mt-7 max-w-sm text-sm leading-7 text-slate-300">A source-first research workspace built around Indian statutes, judgments and the way litigators work.</p></div>
        <div className="relative flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-slate-400"><ShieldCheck size={18} className="text-[#f59e0b]" />Private by default. Documents stay on this device.</div>
      </aside>
      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[680px] rounded-lg border border-slate-200 bg-white px-5 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.10)] sm:px-8 lg:px-10">
          <div className="mb-7 flex items-start justify-between gap-4 border-b border-slate-100 pb-6"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b45309]">Workspace setup</p><h1 className="mt-2 font-serif text-3xl font-bold text-[#0f172a] sm:text-[34px]">Set up your practice</h1><p className="mt-2 text-sm text-slate-500">Personalize your legal research workspace.</p></div><div className="hidden rounded-full bg-slate-100 p-3 text-slate-600 sm:block"><Users size={20} /></div></div>
          <div><label htmlFor="full-name" className="text-sm font-bold text-slate-800">Full name</label><input id="full-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Adv. Meera Shah" autoComplete="name" className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none ring-[#f59e0b]/20 placeholder:text-slate-400 focus:border-[#f59e0b] focus:ring-4" /></div>
          <fieldset className="mt-7"><legend className="text-sm font-bold text-slate-800">Practice area</legend><div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{practices.map(({ name: item, description, icon: Icon }) => { const active = practice === item; return <button type="button" key={item} aria-pressed={active} onClick={() => setPractice(item)} className={`relative min-h-24 rounded-md border p-4 text-left outline-none ${active ? "border-[#0f172a] bg-[#0f172a] text-white shadow-md" : "border-slate-200 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"}`}>{active && <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-[#f59e0b] text-[#0f172a]"><Check size={13} strokeWidth={3} /></span>}<Icon size={19} className={active ? "text-[#f59e0b]" : "text-slate-500"} /><span className="mt-3 block text-sm font-bold">{item}</span><span className={`mt-1 block text-[11px] leading-4 ${active ? "text-slate-300" : "text-slate-500"}`}>{description}</span></button>; })}</div></fieldset>
          <fieldset className="mt-7"><legend className="text-sm font-bold text-slate-800">Language</legend><div className="mt-3 inline-grid grid-cols-2 rounded-md border border-slate-300 bg-slate-100 p-1"><button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")} className={`min-w-28 rounded px-4 py-2.5 text-sm font-semibold ${language === "en" ? "bg-white text-[#0f172a] shadow-sm ring-1 ring-slate-200" : "text-slate-500"}`}>English</button><button type="button" aria-pressed={language === "hi"} onClick={() => setLanguage("hi")} className={`min-w-28 rounded px-4 py-2.5 text-sm font-semibold ${language === "hi" ? "bg-white text-[#0f172a] shadow-sm ring-1 ring-slate-200" : "text-slate-500"}`}>हिंदी</button></div></fieldset>
          <button type="button" disabled={!name.trim()} onClick={() => { setProfile(name.trim(), practice, language); router.replace("/home"); }} className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#f59e0b] px-5 text-sm font-bold text-[#0f172a] shadow-sm hover:bg-[#eaa008] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">Continue to workspace<ArrowRight size={18} /></button>
        </div>
      </section>
    </main>
  );
}
