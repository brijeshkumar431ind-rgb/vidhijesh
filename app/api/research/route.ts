import { NextRequest, NextResponse } from "next/server";
import { research } from "@/lib/research";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const language = body.language === "hi" ? "hi" : "en";
    if (!query) return NextResponse.json({ error: "A research query is required." }, { status: 400 });
    return NextResponse.json(await research(query, language));
  } catch {
    return NextResponse.json({ error: "Research could not be completed." }, { status: 500 });
  }
}
