"use client";

import Image from "next/image";
import { Icon } from "./icons";
import { useLocale } from "./locale-provider";
import { hero, heroStats, school, tickerItems, ui } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

/** 不同语言的字面长度差异较大，标题字号单独收敛 */
const titleSize: Record<Locale, string> = {
  zh: "text-[clamp(2.6rem,5.6vw,4.4rem)] leading-[1.1]",
  en: "text-[clamp(2.1rem,4.4vw,3.5rem)] leading-[1.14]",
  lo: "text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.35]",
  ko: "text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.2]",
};

function Ticker() {
  const { t } = useLocale();

  return (
    <div className="relative border-t border-paper/12 bg-pine-deep/72 backdrop-blur-md">
      <div className="shell flex h-12 items-center gap-5">
        <span className="flex shrink-0 items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-gold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-cinnabar opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-cinnabar" />
          </span>
          {t(ui.notice)}
        </span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_2%,black_96%,transparent)]">
          <div className="marquee-track flex w-max animate-marquee">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-10 pr-10"
                aria-hidden={copy === 1}
              >
                {tickerItems.map((item, i) => {
                  const text = t(item);
                  return (
                    <a
                      key={`${copy}-${i}`}
                      href="#admission"
                      className="flex items-center gap-3 whitespace-nowrap text-[13px] text-paper/72 transition-colors hover:text-paper"
                    >
                      <span className="h-1 w-1 rotate-45 bg-gold/70" />
                      {text}
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { locale, t } = useLocale();
  const isLao = locale === "lo";

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[calc(100svh-126px)] flex-col justify-end overflow-hidden bg-pine-deep"
    >
      <Image
        src="/images/campus-hero.jpg"
        alt={t(school.name) + " — campus"}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(102deg,rgba(8,42,38,0.93)_0%,rgba(8,42,38,0.82)_38%,rgba(8,42,38,0.38)_66%,rgba(8,42,38,0.66)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-pine-deep/95 via-pine-deep/40 to-transparent" />

      <div className="relative z-10 w-full">
        <div className="shell grid grid-cols-1 items-end gap-12 pt-24 pb-14 lg:grid-cols-12 lg:gap-8 lg:pt-32">
          {/* 主文案 */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="flex items-start gap-3">
              <span className="mt-2.5 h-px w-10 shrink-0 bg-gold/80" />
              <p
                lang={isLao ? "lo" : undefined}
                className={`text-[12.5px] leading-relaxed tracking-wide text-gold ${
                  isLao ? "font-lao" : ""
                }`}
              >
                {t(hero.eyebrow)}
              </p>
            </div>

            <h1
              className={`mt-5 whitespace-pre-line font-serif text-paper ${titleSize[locale]}`}
            >
              {t(hero.title)}
              {locale === "zh" ? <span className="text-gold">。</span> : null}
              {locale === "en" ? <span className="text-gold">.</span> : null}
            </h1>

            <p className="mt-5 max-w-xl text-[14.5px] leading-[1.9] text-paper/88">
              {t(hero.lead, "hero.lead")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={hero.primaryCta.href}
                className="group inline-flex items-center gap-2.5 bg-cinnabar px-7 py-3.5 text-[14px] font-medium tracking-wide text-white transition-colors hover:bg-[#a03f24]"
              >
                {t(hero.primaryCta.label)}
                <Icon name="arrow" className="arrow-shift h-4 w-4" />
              </a>
              <a
                href={hero.secondaryCta.href}
                className="inline-flex items-center gap-2.5 border border-paper/30 px-6 py-3.5 text-[14px] text-paper/85 transition-colors hover:border-paper/60 hover:text-paper"
              >
                {t(hero.secondaryCta.label)}
              </a>
            </div>

            <div className="mt-9 flex flex-col gap-1.5 border-l border-gold/40 pl-4">
              <p
                className={`text-[12.5px] leading-relaxed tracking-[0.14em] text-paper/70 ${
                  isLao ? "font-lao" : ""
                }`}
              >
                {t(school.slogan)}
              </p>
            </div>
          </div>

          {/* 数据卡 */}
          <div className="lg:col-span-5 xl:col-span-4 xl:col-start-9">
            <div className="border border-paper/25 bg-pine-deep/72 backdrop-blur-md">
              <div className="grid grid-cols-2">
                {heroStats.map((stat, i) => (
                  <div
                    key={stat.value}
                    className={`px-4 py-5 xl:px-5 ${
                      i % 2 === 1 ? "border-l border-paper/12" : ""
                    } ${i < 2 ? "border-b border-paper/12" : ""}`}
                  >
                    <p className="flex items-baseline gap-1 font-serif text-[27px] leading-none text-paper">
                      {stat.value}
                      <span className="text-[12px] text-gold">{t(stat.unit)}</span>
                    </p>
                    <p className="mt-2.5 text-[11px] leading-snug tracking-wide text-paper/60">
                      {t(stat.label)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Ticker />
      </div>
    </section>
  );
}
