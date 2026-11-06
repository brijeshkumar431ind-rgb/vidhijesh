import judgments from "@/data/judgments.json";
import bareActs from "@/data/bare-acts.json";
import { Language, ResearchResult } from "./types";

/**
 * Single integration seam for Indian Kanoon retrieval and the model endpoint.
 * Replace the seeded fallback inside this function to enable live retrieval.
 */
export async function research(query: string, language: Language = "en"): Promise<ResearchResult> {
  const envConfigured = process.env.INDIAN_KANOON_API_KEY && process.env.AI_API_KEY;
  void envConfigured; // The seeded fallback remains intentional for demos.

  const lower = query.toLowerCase();
  const bailQuery = /bail|anticipatory|arrest|zamanat|जमानत/.test(lower);
  const sectionQuery = /482|483|438|304|308/.test(query);
  const selectedJudgments = judgments.filter((judgment) =>
    bailQuery || /bail|murder|homicide/.test(judgment.subject.toLowerCase())
  ).slice(0, 4);

  const sectionMatches = bareActs.flatMap((act) =>
    Object.entries(act.sections)
      .filter(([section]) => sectionQuery ? query.includes(section) : /bail|anticipatory/.test(lower) && ["482", "483", "438", "480"].includes(section))
      .map(([section, summary]) => ({ act: act.act, section, summary: String(summary), url: `https://indiankanoon.org/doc/?search=${encodeURIComponent(`${act.act} Section ${section}`)}` }))
  );

  const statutes = sectionMatches.length ? sectionMatches : [{
    act: "Bharatiya Nagarik Suraksha Sanhita, 2023",
    section: "482 / 483",
    summary: "High Court powers concerning bail and protection against misuse of legal process.",
    url: "https://indiankanoon.org/doc/?search=BNSS%20482%20483",
  }];

  return {
    query,
    issues: [
      "Nature of the offence and applicable procedural framework",
      "Custodial necessity, flight risk and likelihood of tampering evidence",
      "Personal liberty, antecedents and cooperation with investigation",
      "Relief sought and whether interim or regular bail safeguards apply",
    ],
    statutes,
    judgments: selectedJudgments,
    suggestions: [
      { id: "next-1", type: "Next Step", text: language === "hi" ? "आप दलील और तथ्यों से संबंधित जमानत पत्र की रूपरेखा तैयार करने पर विचार कर सकते हैं।" : "You may consider preparing a bail submission mapped to the relevant procedural section and material facts.", why: "The retrieved procedural provisions and precedents indicate liberty and custodial necessity as central questions.", url: statutes[0].url },
      { id: "gap-1", type: "Gap Alert", text: "You may examine whether a cognate section or condition also needs to be addressed based on the charge frame.", why: "Section overlap was mentioned in the retrieved research context.", url: "https://indiankanoon.org/search/?formInput=BNSS%20bail%20section" },
      { id: "precedent-1", type: "Related Precedent", text: "You may compare the factual safeguards applied in Siddharam Satlingappa Mhetre and Arnesh Kumar.", why: "Both authorities concern liberty safeguards and the limits of coercive process.", url: selectedJudgments[0]?.url || judgments[0].url },
      { id: "strategy-1", type: "Strategy Tip", text: "You may organize the submission around the investigation stage, compliance record and proposed conditions.", why: "The retrieved authorities repeatedly treat cooperation, antecedents and necessity as distinct considerations.", url: "https://indiankanoon.org/search/?formInput=bail%20custodial%20necessity%20cooperation" },
    ],
    note: `Research note: ${query}\n\nIssues: offence characterization, custodial necessity, liberty safeguards and procedural relief.\n\nApplicable law: ${statutes.map((item) => `${item.act}, ${item.section}`).join("; ")}.\n\nPrecedents: ${selectedJudgments.map((item) => item.title).join("; ")}.\n\nThis is research assistance, not legal advice.`,
  };
}
