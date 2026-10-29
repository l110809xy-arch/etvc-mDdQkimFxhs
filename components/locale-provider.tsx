"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  defaultLocale,
  isLocale,
  LOCALE_STORAGE_KEY,
  localeMeta,
  pick,
  type Locale,
  type Localized,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** 取四语文案中当前语言的一条 */
  t: (value: Localized) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** SSR 阶段用 useEffect，客户端用 useLayoutEffect（在首次绘制前同步已保存的语言，避免闪烁） */
const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [switching, setSwitching] = useState(false);
  const localeRef = useRef<Locale>(defaultLocale);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 首次挂载：读取本地保存的语言，在绘制前完成切换
  useIsoLayoutEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored) && stored !== localeRef.current) {
        localeRef.current = stored;
        setLocaleState(stored);
      }
    } catch {
      /* localStorage 不可用时保持默认语言 */
    }
  }, []);

  // 同步 <html lang> 与字体作用域
  useEffect(() => {
    const root = document.documentElement;
    root.lang = localeMeta[locale].htmlLang;
    root.dataset.locale = locale;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      /* 忽略写入失败 */
    }
  }, [locale]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    if (next === localeRef.current) return;
    localeRef.current = next;

    // 先压暗再换文案，形成一次极短的交叉淡入，避免文字硬切
    setSwitching(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLocaleState(next);
      setSwitching(false);
    }, 140);
  }, []);

  const t = useCallback((value: Localized) => pick(value, locale), [locale]);

  // locale 变化时重建 t，保证依赖 t 的组件拿到新语言
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>
      <div
        className="flex min-h-full flex-1 flex-col transition-opacity duration-150 ease-out"
        style={{ opacity: switching ? 0.35 : 1 }}
      >
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale 必须在 <LocaleProvider> 内使用");
  }
  return ctx;
}
