"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  defaultLocale,
  localeMeta,
  localePath,
  pick,
  type Locale,
  type Localized,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  /** 切换语言 = 跳到对应语言的 URL，保证每种语言都有独立可收录的地址 */
  setLocale: (next: Locale) => void;
  /** 取四语文案中当前语言的一条 */
  t: (value: Localized) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * 语言由路由决定（/ 为中文，/lo /en /ko 为其余语言），
 * 因此服务端渲染出的 HTML 就是该语言的内容，爬虫无需执行 JS 也能读到正确文案。
 */
export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const locale = initialLocale;
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      // 保留当前锚点，切换语言后仍停在同一个版块
      const hash = typeof window === "undefined" ? "" : window.location.hash;
      router.push(`${localePath(next)}${hash}`, { scroll: false });
    },
    [locale, router],
  );

  const t = useCallback((value: Localized) => pick(value, locale), [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>
      <div
        // 服务端就把语言写到包裹层：字体选择器与屏幕阅读器无需等 JS 即可生效
        lang={localeMeta[locale].htmlLang}
        data-locale={locale}
        className="flex min-h-full flex-1 flex-col"
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
