"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BookMarked, FileText, Gavel, Mic, Paperclip, Search, ShieldCheck, X } from "lucide-react";
import { openDB } from "idb";
import { research } from "@/lib/research";
import { useAppStore } from "@/lib/store";
import { translate } from "@/lib/i18n";

interface SpeechRecognitionResultLike { 0: { transcript: string }; }
interface SpeechRecognitionEventLike { results: ArrayLike<SpeechRecognitionResultLike>; }
interface SpeechRecognitionLike { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: SpeechRecognitionEventLike) => void) | null; onend: (() => void) | null; onerror: (() => void) | null; start: () => void; stop: () => void; }
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

async function documentDatabase() {
  return openDB("jeshvidhi-documents", 1, { upgrade(database) { if (!database.objectStoreNames.contains("files")) database.createObjectStore("files", { keyPath: "name" }); } });
}

export default function HomePage() {
  const router = useRouter();
  const { language, name, practice, queryCount, lastQueryDate, incrementQuery, setCurrentResult } = useAppStore();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string>("");
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
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

  async function attachFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    const db = await documentDatabase();
    await db.put("files", { name: file.name, type: file.type, size: file.size, addedAt: new Date().toISOString(), data: await file.arrayBuffer() });
    setAttachedFile(file.name);
  }

  function toggleVoiceInput() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const browserWindow = window as typeof window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };
    const Recognition = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceStatus(language === "hi" ? "यह ब्राउज़र आवाज़ इनपुट उपलब्ध नहीं करता।" : "Voice input is not supported in this browser.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index][0].transcript).join(" ");
      setQuery((current) => current ? `${current} ${transcript}` : transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); setVoiceStatus(language === "hi" ? "आवाज़ पहचान नहीं हो सकी। कृपया फिर प्रयास करें।" : "Voice could not be recognised. Please try again."); };
    recognitionRef.current = recognition;
    setVoiceStatus("");
    setListening(true);
    recognition.start();
  }

  const chips = [
    { label: translate(language, "bail"), icon: Gavel, value: "Find anticipatory bail authorities and conditions" },
    { label: translate(language, "sectionLookup"), icon: BookMarked, value: "Find the applicability of Sections 482 and 483 BNSS" },
    { label: translate(language, "precedent"), icon: Search, value: "Find Supreme Court bail precedents" },
  ];

  return <main className="min-h-[calc(100vh-4rem)] bg-[#f4f6f8] px-4 py-10 pb-24 md:px-10 md:py-14"><div className="mx-auto max-w-5xl">
    <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-3 flex items-center gap-2"><span className="h-px w-8 bg-[#f59e0b]"/><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b45309]">{practice ? `${practice} ${translate(language, "litigation")}` : translate(language, "litigation")}</p></div><h1 className="font-serif text-4xl font-bold leading-tight text-[#0f172a] md:text-5xl">{translate(language, "welcome")}, {name || "Advocate"}</h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{language === "hi" ? "आज किस कानूनी विषय पर शोध करना है, वह नीचे लिखें।" : "Bring the facts. We’ll organise the law, authorities and next steps."}</p></div><div className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 shadow-sm"><span className="text-sm font-bold text-[#0f172a]">{used} / 20</span><span className="h-4 w-px bg-slate-200"/><span className="text-[11px] font-medium text-slate-500">{translate(language, "queriesToday")}</span></div></div>
    {used >= 20 && <div className="mb-5 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">{translate(language, "upgrade")}</div>}
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,.10)]"><div className="h-1.5 bg-[#f59e0b]"/><div className="p-5 md:p-8"><label htmlFor="research-query" className="block font-serif text-2xl font-bold text-[#0f172a] md:text-3xl">{translate(language, "researchPrompt")}</label><div className="mt-5 rounded-lg border border-slate-300 bg-white p-2 shadow-sm focus-within:border-[#f59e0b] focus-within:ring-4 focus-within:ring-[#f59e0b]/10"><textarea id="research-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={translate(language, "researchPlaceholder")} className="min-h-36 w-full resize-none rounded-md border-0 px-3 py-3 text-base leading-7 text-slate-900 outline-none placeholder:text-slate-400 md:min-h-40" />{attachedFile && <div className="mx-2 mb-2 flex w-fit max-w-full items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"><FileText size={14}/><span className="truncate">{attachedFile}</span><button onClick={() => setAttachedFile("")} aria-label="Remove attachment" className="text-slate-400 hover:text-slate-700"><X size={14}/></button></div>}<div className="flex items-center justify-between gap-2 px-1 pb-1"><div className="flex items-center gap-1"><input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(event) => attachFile(event.target.files)}/><button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Attach PDF or DOCX" title="Attach PDF or DOCX" className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-[#0f172a]"><Paperclip size={19}/></button><button type="button" onClick={toggleVoiceInput} aria-label={listening ? "Stop voice input" : "Start voice input"} title={listening ? "Stop listening" : "Start voice input"} className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${listening ? "animate-pulse bg-red-600 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-[#0f172a]"}`}><Mic size={19}/></button></div><button onClick={() => runResearch()} disabled={!query.trim() || loading || used >= 20} className="flex h-11 items-center gap-2 rounded-md bg-[#f59e0b] px-5 text-sm font-bold text-[#0f172a] shadow-sm hover:bg-[#e6a008] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"><Search size={17}/>{loading ? translate(language, "retrieving") : "Search"}</button></div>{voiceStatus && <p className="px-3 pb-2 text-xs text-red-600">{voiceStatus}</p>}</div></div></section>
    <div className="mt-6"><p className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-slate-400">{language === "hi" ? "त्वरित खोज" : "Quick research"}</p><div className="flex flex-wrap gap-3">{chips.map(({ label, icon: Icon, value }) => <button key={label} onClick={() => runResearch(value)} disabled={used >= 20} className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-[#f59e0b] hover:bg-amber-50 hover:text-[#0f172a] disabled:opacity-50"><Icon size={16}/>{label}</button>)}</div></div>
    <div className="mt-9 grid gap-3 sm:grid-cols-3"><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#b45309]">{translate(language, "retrieval")}</p><p className="mt-2 text-sm font-semibold">{translate(language, "retrievalDetail")}</p></div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#b45309]">{translate(language, "precedent")}</p><p className="mt-2 text-sm font-semibold">{translate(language, "precedentDetail")}</p></div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#b45309]">{translate(language, "privacy")}</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={15}/>{translate(language, "privacyDetail")}</p></div></div>
  </div></main>;
}
