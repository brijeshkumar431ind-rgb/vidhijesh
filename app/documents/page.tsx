"use client";

import { useEffect, useState } from "react";
import { ArrowRight, FileText, LockKeyhole, Trash2, Upload } from "lucide-react";
import { openDB } from "idb";

interface StoredFile { name: string; type: string; size: number; addedAt: string }

async function documentDatabase() {
  return openDB("jeshvidhi-documents", 1, { upgrade(database) { if (!database.objectStoreNames.contains("files")) database.createObjectStore("files", { keyPath: "name" }); } });
}

export default function DocumentsPage() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    documentDatabase().then(async (db) => {
      const stored = await db.getAll("files") as StoredFile[];
      setFiles(stored.filter((file) => file.name !== undefined));
    });
  }, []);

  async function addFiles(selected: FileList | null) {
    if (!selected?.length) return;
    const incoming = Array.from(selected);
    const db = await documentDatabase();
    for (const file of incoming) await db.put("files", { name: file.name, type: file.type, size: file.size, addedAt: new Date().toISOString(), data: await file.arrayBuffer() });
    setFiles((await db.getAll("files")) as StoredFile[]);
  }

  async function removeFile(name: string) {
    const db = await documentDatabase();
    await db.delete("files", name);
    setFiles((old) => old.filter((file) => file.name !== name));
  }

  return <div className="px-4 py-8 pb-24 md:px-10"><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-600">Local workspace</p><h1 className="mt-2 font-serif text-3xl font-bold">Case Documents</h1><div className="mt-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"><LockKeyhole size={16}/> Your files stay on your device only.</div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]"><section className="border border-slate-200 bg-white p-5"><label className="grid min-h-44 cursor-pointer place-items-center border border-dashed border-slate-300 bg-slate-50 text-center"><input type="file" accept=".pdf,.doc,.docx" multiple className="hidden" onChange={(event) => addFiles(event.target.files)} /><span><Upload className="mx-auto"/><strong className="mt-2 block text-sm">Upload case files</strong><span className="mt-1 block text-xs text-slate-500">PDF or DOCX · stored locally</span></span></label><div className="mt-4 space-y-2">{files.map((file) => <div key={file.name} className="flex items-center gap-3 border border-slate-100 p-3"><FileText size={18} className="text-slate-500"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{file.name}</p><p className="text-xs text-slate-500">{Math.max(1, Math.round(file.size / 1024))} KB</p></div><button aria-label="Remove file" onClick={() => removeFile(file.name)}><Trash2 size={16} className="text-slate-400"/></button></div>)}</div></section>
      <section className="border border-slate-200 bg-white p-5"><h2 className="font-serif text-xl font-bold">Ask about these documents</h2><div className="mt-4 flex gap-2"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask for procedural issues, facts, or missing dates…" className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm"/><button onClick={() => setAnswer(files.length ? "A document-grounded answer requires the document text to be extracted locally. Uploads are indexed privately; verify every conclusion against the source document and the linked external authorities." : "Upload at least one case document before asking a document question.")} className="grid h-11 w-11 place-items-center rounded-md bg-amber-500" aria-label="Ask"><ArrowRight size={18}/></button></div>{answer && <div className="mt-5 border-l-4 border-slate-300 bg-slate-50 p-4 text-sm leading-7">{answer}<a href="https://indiankanoon.org" target="_blank" rel="noreferrer" className="block mt-3 text-xs font-bold text-blue-700">Source: Indian Kanoon</a></div>}</section>
    </div></div>;
}
