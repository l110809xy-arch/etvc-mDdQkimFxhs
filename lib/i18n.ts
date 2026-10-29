/**
 * 多语言基础定义
 * 支持：老挝语（lo）/ 中文（zh）/ 英文（en）/ 韩语（ko）
 */

export const locales = ["lo", "zh", "en", "ko"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

/** 一条四语文案 */
export type Localized = Record<Locale, string>;

/** 构造四语文案：L(中文, English, ລາວ, 한국어) */
export const L = (
  zh: string,
  en: string,
  lo: string,
  ko: string,
): Localized => ({ zh, en, lo, ko });

export const localeMeta: Record<
  Locale,
  { native: string; english: string; short: string; htmlLang: string }
> = {
  lo: { native: "ລາວ", english: "Lao", short: "LO", htmlLang: "lo" },
  zh: { native: "中文", english: "Chinese", short: "ZH", htmlLang: "zh-CN" },
  en: { native: "English", english: "English", short: "EN", htmlLang: "en" },
  ko: { native: "한국어", english: "Korean", short: "KO", htmlLang: "ko" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** 从四语文案中取出当前语言 */
export function pick(value: Localized, locale: Locale): string {
  return value[locale] ?? value[defaultLocale];
}

export const LOCALE_STORAGE_KEY = "etvc-locale";
