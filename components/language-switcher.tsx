"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { useLocale } from "./locale-provider";
import { locales, localeMeta } from "@/lib/i18n";
import { ui } from "@/lib/content";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

/** 桌面端：导航右侧的语言下拉菜单 */
export function LanguageSwitcher() {
  const { locale, t, localizedHref } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t(ui.languageSwitch)}
        className={`flex h-10 items-center gap-1.5 rounded-full border px-2.5 transition-colors duration-200 ${
          open
            ? "border-pine/35 bg-pine/8 text-pine"
            : "border-pine/15 text-ink/75 hover:border-pine/30 hover:bg-pine/5 hover:text-pine"
        }`}
      >
        <Icon name="public" className="h-[17px] w-[17px]" />
        <span className="text-[11.5px] font-medium tracking-[0.08em]">
          {localeMeta[locale].short}
        </span>
        <Icon
          name="chevronDown"
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            open ? "-rotate-180" : ""
          }`}
        />
      </button>

      {/* 下拉面板 */}
      <div
        className={`absolute top-full right-0 z-50 mt-2 w-[184px] origin-top-right border border-pine/12 bg-paper shadow-[0_18px_44px_-24px_rgba(8,42,38,0.55)] transition-all duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0"
        }`}
        role="presentation"
      >
        <p className="border-b border-pine/10 px-3.5 py-2 text-[9.5px] tracking-[0.22em] text-ink-soft/60">
          {t(ui.language).toUpperCase()}
        </p>
        <ul aria-label={t(ui.language)} className="py-1">
          {locales.map((code) => {
            const active = code === locale;
            return (
              <li key={code}>
                <Link
                  href={localizedHref(code)}
                  hrefLang={localeMeta[code].htmlLang}
                  lang={localeMeta[code].htmlLang}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors duration-150 ${
                    active
                      ? "bg-pine/6 text-pine"
                      : "text-ink/80 hover:bg-paper-2 hover:text-pine"
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="text-[13.5px] leading-tight">
                      {localeMeta[code].native}
                    </span>
                    <span className="mt-0.5 text-[9.5px] tracking-[0.12em] text-ink-soft/55">
                      {localeMeta[code].english.toUpperCase()}
                    </span>
                  </span>
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 transition-opacity duration-150 ${
                      active ? "text-cinnabar opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** 移动端：抽屉菜单里的四语横排选项 */
export function LanguageSwitcherMobile() {
  const { locale, t, localizedHref } = useLocale();

  return (
    <div className="mt-2 border-t border-pine/8 pt-4">
      <p className="text-[9.5px] tracking-[0.22em] text-ink-soft/55">
        {t(ui.language).toUpperCase()}
      </p>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {locales.map((code) => {
          const active = code === locale;
          return (
            <Link
              key={code}
              href={localizedHref(code)}
              hrefLang={localeMeta[code].htmlLang}
              lang={localeMeta[code].htmlLang}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-between gap-2 border px-3 py-2.5 text-[13px] transition-colors duration-150 ${
                active
                  ? "border-pine bg-pine text-paper"
                  : "border-pine/15 text-ink/80 active:bg-paper-2"
              }`}
            >
              <span className="flex items-baseline gap-1.5">
                <span>{localeMeta[code].native}</span>
                <span
                  className={`text-[9px] tracking-[0.14em] ${
                    active ? "text-paper/50" : "text-ink-soft/45"
                  }`}
                >
                  {localeMeta[code].short}
                </span>
              </span>
              {active ? <Check className="h-3.5 w-3.5 text-gold" /> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
