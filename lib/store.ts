"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language, PracticeType, ResearchResult, SuggestionLevel } from "./types";

interface AppState {
  hydrated: boolean;
  name: string;
  practice: PracticeType | null;
  language: Language;
  suggestionLevel: SuggestionLevel;
  queryCount: number;
  uploadCount: number;
  lastQueryDate: string;
  currentResult: ResearchResult | null;
  setProfile: (name: string, practice: PracticeType, language: Language) => void;
  setLanguage: (language: Language) => void;
  setSuggestionLevel: (level: SuggestionLevel) => void;
  setCurrentResult: (result: ResearchResult) => void;
  incrementQuery: () => boolean;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      name: "",
      practice: null,
      language: "en",
      suggestionLevel: "Normal",
      queryCount: 0,
      uploadCount: 0,
      lastQueryDate: today(),
      currentResult: null,
      setProfile: (name, practice, language) => set({ name, practice, language }),
      setLanguage: (language) => set({ language }),
      setSuggestionLevel: (suggestionLevel) => set({ suggestionLevel }),
      setCurrentResult: (currentResult) => set({ currentResult }),
      incrementQuery: () => {
        const state = get();
        const sameDay = state.lastQueryDate === today();
        const used = sameDay ? state.queryCount : 0;
        if (used >= 20) return false;
        set({ queryCount: used + 1, lastQueryDate: today() });
        return true;
      },
    }),
    { name: "jeshvidhi-settings" }
  )
);
