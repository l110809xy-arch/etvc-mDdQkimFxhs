"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  defaultLocale,
  locales,
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
  /**
   * 取四语文案中当前语言的一条。
   * 传了 key 时，优先用后台保存过的覆盖值（content_overrides 表）。
   */
  t: (value: Localized, key?: string) => string;
  /** 同一页面在目标语言下的地址（文章页切语言后仍停在同一篇） */
  localizedHref: (next: Locale) => string;
  /** 首页锚点：当前不在首页时自动补上语言首页前缀，避免 /blog 上点 #about 无反应 */
  homeHref: (hash: string) => string;
  /** 当前是否就在该语言的首页 */
  isHome: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * 从当前路径里剥掉语言前缀，得到「页面自身的后缀」。
 * /            → ""
 * /lo          → ""
 * /blog/x      → "/blog/x"
 * /en/blog/x   → "/blog/x"
 */
function pathSuffixOf(pathname: string): string {
  for (const code of locales) {
    if (code === "zh") continue;
    if (pathname === `/${code}`) return "";
    if (pathname.startsWith(`/${code}/`)) {
      return pathname.slice(`/${code}`.length);
    }
  }
  return pathname === "/" ? "" : pathname;
}

/**
 * 语言由路由决定（/ 为中文，/lo /en /ko 为其余语言），
 * 因此服务端渲染出的 HTML 就是该语言的内容，爬虫无需执行 JS 也能读到正确文案。
 */
export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
  overrides = {},
}: {
  children: ReactNode;
  initialLocale?: Locale;
  /** 后台改过的文案，key 形如 announcement.text|lo */
  overrides?: Record<string, string>;
}) {
  const locale = initialLocale;
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const suffix = useMemo(() => pathSuffixOf(pathname), [pathname]);
  const isHome = suffix === "";

  /**
   * 目标语言下的同一页面地址。
   * 注意中文的 localePath 是 "/"，直接拼 suffix 会得到 "//blog/xxx"，
   * 浏览器会把它当成协议相对地址（host = blog），所以要先去掉尾部斜杠。
   */
  const localizedHref = useCallback(
    (next: Locale) => {
      const base = localePath(next);
      if (!suffix) return base;
      return `${base.replace(/\/+$/, "")}${suffix}`;
    },
    [suffix],
  );

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      // 首页切换语言时保留锚点，仍停在同一个版块；
      // 文章页没有锚点，suffix 会把用户留在同一篇文章。
      const hash =
        suffix === "" && typeof window !== "undefined"
          ? window.location.hash
          : "";
      router.push(`${localizedHref(next)}${hash}`, { scroll: false });
    },
    [locale, router, suffix, localizedHref],
  );

  const homeHref = useCallback(
    (hash: string) => (isHome ? hash : `${localePath(locale)}${hash}`),
    [isHome, locale],
  );

  const t = useCallback(
    (value: Localized, key?: string) => {
      if (key) {
        const custom = overrides[`${key}|${locale}`];
        if (custom && custom.trim()) return custom;
      }
      return pick(value, locale);
    },
    [locale, overrides],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t, localizedHref, homeHref, isHome }),
    [locale, setLocale, t, localizedHref, homeHref, isHome],
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
