"use client";

import Image from "next/image";
import { Icon } from "./icons";
import { useLocale } from "./locale-provider";
import { announcement, contact, footer, school, ui } from "@/lib/content";
import { SITE_HOST, SITE_URL } from "@/lib/seo";

export function SiteFooter() {
  const { locale, t, homeHref } = useLocale();
  const addressLines = contact.addresses[locale] ?? contact.addresses.zh;

  return (
    <footer id="footer" className="bg-pine-deep text-paper/70">
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:gap-8">
          {/* 品牌与联系方式 */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3.5">
              <Image
                src="/images/logo.png"
                alt={t(school.name)}
                width={88}
                height={88}
                className="h-11 w-11 shrink-0"
              />
              <div className="min-w-0">
                <p className="font-serif text-[17px] leading-snug tracking-wide text-paper">
                  {t(school.name)}
                </p>
                <p className="mt-1 text-[9px] tracking-[0.16em] text-paper/45">
                  {t(school.nameSub)}
                </p>
              </div>
            </div>

            <p className="mt-5 text-[12px] leading-relaxed text-paper/50">
              {t(school.slogan)}
            </p>

            <ul className="mt-6 space-y-3 text-[13px] leading-relaxed">
              <li className="flex gap-3">
                <Icon name="location" className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                <span className="flex flex-col gap-0.5">
                  {addressLines.map((line, i) => (
                    <span
                      key={line.text}
                      lang={line.lang}
                      className={
                        i === 0
                          ? "text-paper/80"
                          : `text-[11.5px] text-paper/40 ${
                              line.lang === "lo" ? "font-lao" : ""
                            }`
                      }
                    >
                      {line.text}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                <span className="flex flex-col gap-1">
                  {contact.phones.map((p) => (
                    <a
                      key={p.value}
                      href={`tel:${p.tel}`}
                      className="-my-2 inline-block py-2 transition-colors hover:text-gold"
                    >
                      {p.value}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="public" className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" />
                <a
                  href={contact.facebook.href}
                  target="_blank"
                  rel="noreferrer"
                  className="-my-2 inline-block py-2 transition-colors hover:text-gold"
                >
                  {contact.facebook.value}
                </a>
              </li>
            </ul>
          </div>

          {/* 链接列 */}
          {footer.columns.map((col) => (
            <div key={t(col.title)} className="lg:col-span-2">
              <h3 className="font-serif text-[14px] tracking-[0.14em] text-paper/90">
                {t(col.title)}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={t(link.label)}>
                    <a
                      // 锚点走首页前缀；/blog 这类站内页面直接补语言前缀
                      href={
                        link.href.startsWith("#")
                          ? homeHref(link.href)
                          : `${locale === "zh" ? "" : `/${locale}`}${link.href}`
                      }
                      className="-my-2 inline-block py-2 text-[12.5px] text-paper/55 transition-colors hover:text-gold"
                    >
                      {t(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 招生提示 */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-[14px] tracking-[0.14em] text-paper/90">
              {t(footer.admissionTitle)}
            </h3>
            <p className="mt-5 text-[12px] leading-relaxed text-paper/50">
              {t(announcement.schoolYear)}
              <br />
              {t(announcement.deadline, "announcement.deadline")}
            </p>
            <a
              href={`tel:${contact.phones[0].tel}`}
              className="mt-5 inline-flex items-center gap-2 border border-paper/20 px-3.5 py-2 text-[12px] text-paper/85 transition-colors hover:border-paper/45 hover:text-paper"
            >
              <Icon name="phone" className="h-3.5 w-3.5" />
              {t(ui.phoneConsult)}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-paper/10 py-6 text-[11px] text-paper/35 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {t(school.name)}（{school.abbr}）· {contact.addressEn}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="py-2">{t(footer.partnerLine)}</span>
            <a
              href={SITE_URL}
              className="-my-2 inline-block py-2 tracking-[0.06em] transition-colors hover:text-gold"
            >
              {SITE_HOST}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
