"use client";

import { useMemo, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { useAppStore } from "@/lib/store";

export default function DraftNotePage() {
  const { currentResult } = useAppStore();
  const initial = currentResult?.note || "Run a research query to generate a sourced research note.";
  const [text, setText] = useState(initial);
  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  async function downloadDocx() {
    const document = new Document({ sections: [{ children: text.split("\n").map((line) => new Paragraph({ children: [new TextRun(line)] })) }] });
    const blob = await Packer.toBlob(document);
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = "jeshvidhi-research-note.docx";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <div className="px-4 py-8 pb-24 md:px-10"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-600">Research output</p><h1 className="mt-2 font-serif text-3xl font-bold">Draft Note</h1></div><span className="text-xs text-slate-500">{wordCount} words</span></div><div className="mt-6 mx-auto max-w-4xl border border-slate-200 bg-white shadow-sm"><div className="flex justify-end gap-2 border-b border-slate-200 p-3"><button onClick={() => navigator.clipboard.writeText(text)} className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm"><Copy size={15}/> Copy</button><button onClick={downloadDocx} className="flex items-center gap-2 rounded-md bg-[#0f172a] px-3 py-2 text-sm font-semibold text-white"><Download size={15}/> Download .docx</button></div><textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-[620px] w-full resize-y p-6 font-serif text-base leading-8 outline-none" /></div></div>;
}
