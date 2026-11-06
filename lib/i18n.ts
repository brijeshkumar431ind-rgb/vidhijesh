import en from "@/i18n/en.json";
import hi from "@/i18n/hi.json";
import { Language } from "./types";

export function translate(language: Language, key: keyof typeof en) {
  return (language === "hi" ? hi[key as keyof typeof hi] : en[key]) || en[key];
}
