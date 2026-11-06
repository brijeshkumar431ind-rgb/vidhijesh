"use client";

import { useState } from "react";
import { Copy, Download, ExternalLink, FileText, X } from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { useAppStore } from "@/lib/store";
import { translate } from "@/lib/i18n";

export default function ResultsPage() {
  const { currentResult, language, suggestionLevel } = useAppStore();
  const [draftOpen, setDraftOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function downloadDraft() {
    if (!currentResult) return;
    const document = new Document({ sections: [{ children: currentResult.note.split("\n").map((line) => new Paragraph({ children: [new TextRun(line)] })) }] });
    const blob = await Packer.toBlob(document);
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = "jeshvidhi-research-note.docx";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyDraft() {
    if (!currentResult) return;
    await navigator.clipboard.writeText(currentResult.note);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const allowed = suggestionLevel === "Low" ? ["Next Step"] : suggestionLevel === "Normal" ? ["Next Step", "Gap Alert"] : ["Next Step", "Gap Alert", "Related Precedent", "Strategy Tip"];

  if (!currentResult) return <main className="min-h-[70vh] p-8"><div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 text-center"><h1 className="font-serif text-2xl font-bold text-[#0f172a]">JeshVidhi</h1><p className="mt-3 text-sm text-slate-500">{translate(language, "runQuery")}</p></div></main>;

  return <main className="min-h-full bg-[#f4f6f8] pb-28">
    <header className="border-b border-slate-200 bg-white px-5 py-6 md:px-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b45309]">{translate(language, "researchMemorandum")}</p><h1 className="mt-2 max-w-4xl font-serif text-2xl font-bold text-[#0f172a] md:text-3xl">{currentResult.query}</h1></div><button onClick={() => setDraftOpen(true)} className="flex h-10 items-center gap-2 rounded-md bg-[#0f172a] px-4 text-sm font-bold text-white"><FileText size={16}/> Draft note</button></div></header>
    <div className="mx-auto grid max-w-6xl gap-5 px-4 py-6 md:px-8 lg:grid-cols-[1fr_340px]"><div className="space-y-5">
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm md:p-6"><div className="border-l-4 border-[#f59e0b] pl-4"><h2 className="font-serif text-xl font-bold text-[#0f172a]">{translate(language, "issues")}</h2></div><ol className="mt-5 space-y-3">{currentResult.issues.map((issue, index) => <li key={issue} className="flex gap-3 text-sm leading-6"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#0f172a] text-xs font-bold text-white">{index + 1}</span><span>{issue}</span></li>)}</ol></section>
      <section><h2 className="mb-3 font-serif text-xl font-bold text-[#0f172a]">{translate(language, "law")}</h2><div className="grid gap-3 md:grid-cols-2">{currentResult.statutes.map((item) => <article key={`${item.act}-${item.section}`} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="rounded bg-[#0f172a] px-2.5 py-1 text-xs font-bold text-white">§ {item.section}</span><a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-700">{translate(language, "source")}<ExternalLink size={12}/></a></div><h3 className="mt-4 font-serif text-lg font-bold text-[#0f172a]">{item.act}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p></article>)}</div></section>
      <section><h2 className="mb-3 font-serif text-xl font-bold text-[#0f172a]">{translate(language, "precedents")}</h2><div className="space-y-3">{currentResult.judgments.map((item) => <article key={item.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h3 className="font-serif text-lg font-bold text-[#0f172a]">{item.title}</h3><p className="mt-1 text-xs font-medium text-slate-500">{item.court} · {item.year} · {item.judge}</p></div><a href={item.url} target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-1 text-xs font-bold text-blue-700">{translate(language, "source")}<ExternalLink size={12}/></a></div><p className="mt-3 border-l-2 border-[#f59e0b] pl-3 text-sm leading-6 text-slate-600">{item.holding}</p></article>)}</div></section>
    </div><aside className="h-fit rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-20"><h2 className="font-serif text-xl font-bold text-[#0f172a]">{translate(language, "suggestedSteps")}</h2>{currentResult.suggestions.filter((item) => allowed.includes(item.type)).map((item) => <article key={item.id} className="mt-4 border-t border-slate-100 pt-4"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#b45309]">{item.type}</p><p className="mt-2 text-sm font-semibold leading-6">{item.text}</p><p className="mt-2 text-xs leading-5 text-slate-500"><strong>Why:</strong> {item.why}</p><a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700">{translate(language, "source")}<ExternalLink size={12}/></a></article>)}</aside></div>
    {draftOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/70 p-4" role="dialog" aria-modal="true"><div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#b45309]">Research output</p><h2 className="mt-1 font-serif text-xl font-bold text-[#0f172a]">Draft note</h2></div><button onClick={() => setDraftOpen(false)} aria-label="Close draft" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={20}/></button></div><textarea value={currentResult.note} readOnly className="min-h-[420px] flex-1 resize-none px-6 py-5 font-serif text-sm leading-7 text-slate-700 outline-none"/><div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4"><button onClick={copyDraft} className="flex h-10 items-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold"><Copy size={16}/>{copied ? "Copied" : "Copy"}</button><button onClick={downloadDraft} className="flex h-10 items-center gap-2 rounded-md bg-[#f59e0b] px-4 text-sm font-bold text-[#0f172a]"><Download size={16}/>Download .docx</button></div></div></div>}
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-300 bg-[#0f172a] px-4 py-3 text-center text-xs font-medium text-white md:left-64">{translate(language, "notAdvice")}</div>
  </main>;
}
