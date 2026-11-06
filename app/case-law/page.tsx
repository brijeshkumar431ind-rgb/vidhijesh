"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import judgments from "@/data/judgments.json";

export default function CaseLawPage() {
  const [court, setCourt] = useState("All");
  const [subject, setSubject] = useState("All");
  const [sort, setSort] = useState<"year" | "court">("year");
  const courts = ["All", ...Array.from(new Set(judgments.map((item) => item.court)))];
  const subjects = ["All", ...Array.from(new Set(judgments.map((item) => item.subject)))];
  const rows = useMemo(() => judgments.filter((item) => (court === "All" || item.court === court) && (subject === "All" || item.subject === subject)).sort((a, b) => sort === "year" ? b.year - a.year : a.court.localeCompare(b.court)), [court, subject, sort]);

  return <div className="px-4 py-8 pb-24 md:px-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-600">Authority library</p><h1 className="mt-2 font-serif text-3xl font-bold">Case-Law Table</h1></div><div className="text-sm text-slate-500">{rows.length} judgments</div></div>
    <div className="mt-6 flex flex-wrap gap-3"><select value={court} onChange={(event) => setCourt(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"><option value="All">All courts</option>{courts.slice(1).map((item) => <option key={item}>{item}</option>)}</select><select value={subject} onChange={(event) => setSubject(event.target.value)} className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm">{subjects.map((item) => <option key={item}>{item === "All" ? "All subjects" : item}</option>)}</select><button onClick={() => setSort(sort === "year" ? "court" : "year")} className="flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm"><ArrowUpDown size={15}/> Sort by {sort}</button></div>
    <div className="mt-5 overflow-x-auto border border-slate-200 bg-white"><table className="w-full min-w-[800px] text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Judgment</th><th className="px-4 py-3">Court</th><th className="px-4 py-3">Year</th><th className="px-4 py-3">Judge</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Source</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-slate-100 text-sm"><td className="max-w-sm px-4 py-4 font-serif font-bold">{item.title}<p className="mt-1 font-sans text-xs font-normal leading-5 text-slate-500">{item.holding}</p></td><td className="px-4 py-4 text-slate-600">{item.court}</td><td className="px-4 py-4">{item.year}</td><td className="px-4 py-4 text-slate-600">{item.judge}</td><td className="px-4 py-4 text-slate-600">{item.subject}</td><td className="px-4 py-4"><a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-700">Indian Kanoon <ExternalLink size={12}/></a></td></tr>)}</tbody></table></div>
  </div>;
}
