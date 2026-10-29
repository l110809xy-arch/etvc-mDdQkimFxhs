"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "./icons";
import { LanguageSwitcher, LanguageSwitcherMobile } from "./language-switcher";
import { useLocale } from "./locale-provider";
import { contact, navItems, school, ui } from "@/lib/content";

function Logo() {
  const { locale, t } = useLocale();
  // 英文 / 老挝语校名较长，缩小字号并限制两行，避免撑破页眉
  const nameClass =
    locale === "lo"
      ? "line-clamp-2 max-w-[168px] text-[11.5px] leading-[1.4] sm:max-w-[196px] md:text-[12.5px]"
      : locale === "en"
        ? "line-clamp-2 max-w-[150px] text-[12.5px] leading-[1.3] sm:max-w-[176px] md:text-[13.5px]"
        : "whitespace-nowrap text-[17px] leading-tight sm:text-[19px] md:text-[21px]";

  return (
    <a href="#top" className="group flex min-w-0 items-center gap-3 md:gap-3.5">
      <Image
        src="/images/logo.png"
        alt={t(school.name)}
        width={96}
        height={96}
        priority
        className="h-10 w-10 shrink-0 md:h-[52px] md:w-[52px]"
      />
      <span className="flex min-w-0 flex-col">
        <span className={`font-serif tracking-[0.02em] text-ink ${nameClass}`}>
          {t(school.name)}
        </span>
        <span className="mt-1 hidden truncate text-[9px] font-medium tracking-[0.08em] text-ink-soft/80 sm:block xl:text-[9.5px]">
          {t(school.nameSub)}
        </span>
      </span>
    </a>
  );
}

export function SiteHeader() {
  const { locale, t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  // 记录菜单是在哪个语言下展开的：语言一变，菜单自动收起，无需在 effect 里改 state
  const [openFor, setOpenFor] = useState<typeof locale | null>(null);
  const open = openFor === locale;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleMenu = () => setOpenFor(open ? null : locale);
  const closeMenu = () => setOpenFor(null);

  return (
    <header className="sticky top-0 z-50">
      {/* 顶部信息条 */}
      <div className="hidden bg-pine-deep text-paper/65 md:block">
        <div className="shell flex h-9 items-center justify-between gap-6">
          <p className="truncate text-[11px] tracking-[0.14em]">{t(ui.topbarLeft)}</p>
          <nav className="flex shrink-0 items-center gap-6 text-[11px]">
            <a
              href={contact.facebook.href}
              target="_blank"
              rel="noreferrer"
              className="tracking-[0.1em] transition-colors hover:text-gold"
            >
              Facebook
            </a>
            <a
              href={`tel:${contact.phones[0].tel}`}
              className="border-l border-paper/20 pl-6 tracking-[0.06em] whitespace-nowrap text-paper/90 transition-colors hover:text-gold"
            >
              {t(ui.topbarConsult)} {contact.phones[0].value}
            </a>
          </nav>
        </div>
      </div>

      {/* 主导航 */}
      <div
        className={`border-b border-pine/10 bg-paper/92 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_30px_-18px_rgba(8,42,38,0.45)]" : ""
        }`}
      >
        <div
          className={`shell flex items-center justify-between gap-3 transition-all duration-300 xl:gap-6 ${
            scrolled ? "h-[68px]" : "h-[70px] md:h-[86px]"
          }`}
        >
          <Logo />

          <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative whitespace-nowrap px-1.5 py-2 text-[12.5px] text-ink/85 transition-colors hover:text-pine xl:px-3.5 xl:text-[14.5px]"
              >
                {t(item.label)}
                <span className="absolute inset-x-1.5 -bottom-0.5 h-[2px] origin-left scale-x-0 bg-cinnabar transition-transform duration-300 group-hover:scale-x-100 xl:inset-x-3.5" />
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 xl:gap-2">
            <LanguageSwitcher />
            <a
              href={`tel:${contact.phones[0].tel}`}
              aria-label={t(ui.phoneConsult)}
              className="hidden h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-pine/8 hover:text-pine sm:grid lg:hidden xl:grid"
            >
              <Icon name="phone" className="h-[18px] w-[18px]" />
            </a>
            <a
              href="#admission"
              className="hidden items-center gap-2 whitespace-nowrap bg-cinnabar px-4 py-2.5 text-[13px] font-medium tracking-wide text-white transition-colors hover:bg-[#a03f24] sm:inline-flex xl:px-5 xl:text-[13.5px]"
            >
              {t(ui.applyOnline)}
              <Icon name="arrowUpRight" className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={t(open ? ui.closeMenu : ui.openMenu)}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center text-ink lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div
        className={`overflow-hidden border-b border-pine/10 bg-paper transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? "max-h-[82vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="shell flex max-h-[82vh] flex-col overflow-y-auto py-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="flex items-center justify-between border-b border-pine/8 py-3.5 text-[15px] text-ink/85"
            >
              {t(item.label)}
              <Icon name="arrowUpRight" className="h-4 w-4 text-ink-soft/50" />
            </a>
          ))}

          <LanguageSwitcherMobile />

          <a
            href="#admission"
            onClick={closeMenu}
            className="mt-4 mb-3 inline-flex items-center justify-center gap-2 bg-cinnabar px-5 py-3 text-[14px] font-medium text-white"
          >
            {t(ui.applyOnline)}
            <Icon name="arrowUpRight" className="h-4 w-4" />
          </a>
        </nav>
      </div>
    </header>
  );
}
