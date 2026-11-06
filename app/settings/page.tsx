"use client";

import { useAppStore } from "@/lib/store";
import { Language, SuggestionLevel } from "@/lib/types";

export default function SettingsPage() {
  const store = useAppStore();
  const used = store.lastQueryDate === new Date().toISOString().slice(0, 10) ? store.queryCount : 0;
  const hindi = store.language === "hi";
  return <main className="min-h-full bg-[#f4f6f8] px-4 py-8 pb-24 md:px-10"><div className="mx-auto max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b45309]">{hindi ? "वरीयताएँ" : "Preferences"}</p><h1 className="mt-2 font-serif text-3xl font-bold text-[#0f172a]">{hindi ? "सेटिंग्स" : "Settings"}</h1><div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <section className="border-b border-slate-100 p-5 md:p-6"><h2 className="font-semibold text-[#0f172a]">{hindi ? "भाषा" : "Language"}</h2><div className="mt-3 inline-grid grid-cols-2 rounded-md bg-slate-100 p-1">{(["en", "hi"] as Language[]).map((language) => <button key={language} onClick={() => store.setLanguage(language)} className={`min-w-28 rounded px-4 py-2.5 text-sm font-semibold ${store.language === language ? "bg-white text-[#0f172a] shadow-sm" : "text-slate-500"}`}>{language === "en" ? "English" : "हिंदी"}</button>)}</div></section>
    <section className="border-b border-slate-100 p-5 md:p-6"><h2 className="font-semibold text-[#0f172a]">{hindi ? "सुझाव स्तर" : "Suggestion level"}</h2><div className="mt-3 grid grid-cols-3 gap-2">{(["Low", "Normal", "High"] as SuggestionLevel[]).map((level) => <button key={level} onClick={() => store.setSuggestionLevel(level)} className={`rounded-md border py-2.5 text-sm font-semibold ${store.suggestionLevel === level ? "border-[#0f172a] bg-[#0f172a] text-white" : "border-slate-200 text-slate-600 hover:border-slate-400"}`}>{level}</button>)}</div><p className="mt-3 text-xs text-slate-500">Normal shows the next step and gap alerts.</p></section>
    <section className="border-b border-slate-100 p-5 md:p-6"><h2 className="font-semibold text-[#0f172a]">{hindi ? "मुफ्त योजना उपयोग" : "Free plan usage"}</h2><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#f59e0b]" style={{ width: `${Math.min(100, used * 5)}%` }}/></div><div className="mt-3 flex items-center justify-between text-sm"><span className="text-slate-600">{used} / 20 queries used today</span><span className="font-bold text-[#0f172a]">{store.uploadCount} / 3 uploads</span></div></section>
    <section className="border-b border-slate-100 p-5 md:p-6"><h2 className="font-semibold text-[#0f172a]">{hindi ? "गोपनीयता" : "Privacy"}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Your uploaded files are stored on your device only. Your data is not used to train models.</p></section>
    <section className="bg-slate-50 p-5 md:p-6"><h2 className="font-semibold text-[#0f172a]">{hindi ? "अस्वीकरण" : "Disclaimer"}</h2><p className="mt-2 text-sm leading-6 text-slate-600">Not legal advice. Verify every citation independently before relying on it in court or legal work.</p></section>
  </div></div></main>;
}
