"use client";

import Image from "next/image";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icons";
import { Gallery } from "@/components/gallery";
import { useLocale } from "@/components/locale-provider";
import {
  about,
  academics,
  admissions,
  announcement,
  contact,
  faq,
  gallery,
  school,
  ui,
  welfare,
} from "@/lib/content";

type ContactLine = { text: string; lang: string; tel?: string };
type ContactItem = {
  icon: "location" | "phone" | "public";
  label: string;
  lines: ContactLine[];
  isAddress?: boolean;
  href?: string;
};

/** 文档 Announcement Banner */
function AnnouncementBand() {
  const { t } = useLocale();

  return (
    <section id="announcement" className="border-b border-pine/10 bg-paper-2">
      <div className="shell py-7 md:py-9">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 shrink-0 bg-cinnabar px-2.5 py-1 text-[11px] tracking-[0.12em] whitespace-nowrap text-white">
              {t(ui.notice)}
            </span>
            <div>
              <p className="text-[10.5px] font-medium tracking-[0.22em] text-ink-soft/70">
                ANNOUNCEMENT · {t(announcement.schoolYear)}
              </p>
              <p className="mt-2 font-serif text-[17px] leading-snug text-pine md:text-[20px]">
                {t(announcement.text)}
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-cinnabar">
                {t(announcement.deadline)}
              </p>
            </div>
          </div>
          <a
            href="#admission"
            className="group inline-flex shrink-0 items-center gap-2 bg-pine px-6 py-3 text-[13.5px] font-medium tracking-wide text-paper transition-colors hover:bg-jade"
          >
            {t(ui.applyOnline)}
            <Icon name="arrow" className="arrow-shift h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/** 文档 2.2 About Us：历史与沿革 + 三条使命 */
function About() {
  const { t } = useLocale();

  return (
    <section id="about" className="bg-paper py-20 md:py-28">
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -top-4 -left-4 h-24 w-24 border-t border-l border-gold/60" />
              <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
                <Image
                  src="/images/campus-group.jpg"
                  alt={t(about.imageAlt)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-3 -bottom-6 bg-pine px-6 py-5 text-paper md:-right-6">
                <p className="font-serif text-[30px] leading-none">{school.founded}</p>
                <p className="mt-2 text-[10.5px] tracking-[0.2em] text-paper/55">
                  {t(ui.yearFounded)}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-cinnabar" />
                <p className="text-[11px] font-medium tracking-[0.26em] text-cinnabar">
                  {t(about.eyebrow)}
                </p>
              </div>
              <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.35] text-pine">
                {t(about.title)}
              </h2>
              <div className="mt-6 space-y-4">
                {about.paragraphs.map((p, i) => (
                  <p key={i} className="max-w-xl text-[14.5px] leading-[2] text-ink-soft">
                    {t(p)}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <dl className="mt-9 grid grid-cols-1 gap-px border border-pine/12 bg-pine/12 sm:grid-cols-2">
                {about.facts.map((fact, i) => (
                  <div key={i} className="bg-paper px-5 py-4">
                    <dt className="text-[11px] tracking-[0.16em] text-ink-soft/70">
                      {t(fact.label)}
                    </dt>
                    <dd className="mt-1.5 font-serif text-[15px] text-pine">
                      {t(fact.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {/* 使命 */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-cinnabar" />
              <p className="text-[11px] font-medium tracking-[0.26em] text-cinnabar">
                {t(ui.missionLabel)}
              </p>
            </div>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-px bg-pine/12 md:grid-cols-3">
            {about.missions.map((m, i) => (
              <Reveal key={m.no} delay={i * 90}>
                <div className="h-full bg-paper-2 p-7">
                  <span className="font-serif text-[13px] tracking-[0.18em] text-cinnabar">
                    {m.no}
                  </span>
                  <h3 className="mt-5 font-serif text-[19px] leading-snug text-ink">
                    {t(m.title)}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.9] text-ink-soft">
                    {t(m.desc)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** 文档 2.3 Academics */
function Academics() {
  const { t } = useLocale();

  return (
    <section id="academics" className="border-y border-pine/10 bg-paper-2 py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-cinnabar" />
              <p className="text-[11px] font-medium tracking-[0.26em] text-cinnabar">
                {t(academics.eyebrow)}
              </p>
            </div>
            <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight text-pine">
              {t(academics.title)}
            </h2>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <dl className="divide-y divide-pine/10 border-t border-pine/10">
              <div className="flex flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                <dt className="w-28 shrink-0 text-[12px] tracking-[0.14em] text-ink-soft/75">
                  {t(academics.systemLabel)}
                </dt>
                <dd className="font-serif text-[15.5px] leading-relaxed text-pine">
                  {t(academics.systemValue)}
                </dd>
              </div>
              <div className="flex flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:gap-6">
                <dt className="w-28 shrink-0 text-[12px] tracking-[0.14em] text-ink-soft/75">
                  {t(academics.timeLabel)}
                </dt>
                <dd className="font-serif text-[15.5px] leading-relaxed text-pine">
                  {t(academics.timeValue)}
                </dd>
              </div>
            </dl>

            <p className="mt-8 text-[11px] tracking-[0.2em] text-ink-soft/60">
              {t(academics.year1Label)}
            </p>
            <ul className="mt-4">
              {academics.courses.map((c, i) => (
                <Reveal key={i} delay={i * 60} as="li">
                  <div className="flex items-baseline gap-5 border-t border-pine/10 py-4 last:border-b">
                    <span className="w-6 shrink-0 font-serif text-[12px] text-cinnabar">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-[16.5px] text-ink">{t(c.name)}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-paper-3 lg:aspect-[4/5]">
              <Image
                src={academics.image.src}
                alt={t(academics.image.alt)}
                fill
                sizes="(max-width: 1024px) 100vw, 460px"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** 文档 2.4 Admissions & Tuition */
function Admissions() {
  const { t } = useLocale();

  return (
    <section id="admission" className="bg-paper py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-cinnabar" />
              <p className="text-[11px] font-medium tracking-[0.26em] text-cinnabar">
                {t(admissions.eyebrow)}
              </p>
            </div>
            <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight text-pine">
              {t(admissions.title)}
            </h2>
          </div>
          <p className="max-w-sm text-[13px] leading-relaxed text-ink-soft">
            {t(announcement.text)}
          </p>
        </div>

        {/* 报名流程 */}
        <div className="mt-12">
          <p className="text-[11px] tracking-[0.2em] text-ink-soft/60">{t(ui.steps)}</p>
          <ol className="mt-4 grid grid-cols-1 gap-px bg-pine/12 md:grid-cols-3">
            {admissions.steps.map((step, i) => (
              <Reveal key={step.no} delay={i * 80} as="li">
                <div className="flex h-full items-start gap-4 bg-paper-2 p-6">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pine font-serif text-[13px] text-paper">
                    {step.no}
                  </span>
                  <p className="mt-1 font-serif text-[15.5px] leading-snug text-ink">
                    {t(step.title)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* 报名材料 */}
        <div className="mt-12">
          <p className="text-[11px] tracking-[0.2em] text-ink-soft/60">{t(ui.documents)}</p>
          <ul className="mt-4 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {admissions.documents.map((doc, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 border-t border-pine/10 py-3.5 text-[13.5px] text-ink-soft"
              >
                <span className="mt-[7px] h-1 w-1 shrink-0 rotate-45 bg-cinnabar/70" />
                {t(doc)}
              </li>
            ))}
          </ul>
        </div>

        {/* 学费表 */}
        <div className="mt-14 border-t border-pine/12 pt-12">
          <p className="text-[11px] tracking-[0.2em] text-ink-soft/60">
            {t(ui.tuitionTitle)}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-8">
              <div className="-mx-1 overflow-x-auto px-1">
                <table className="w-full border-collapse text-left">
                  <caption className="sr-only">{t(admissions.tuitionCaption)}</caption>
                  <thead>
                    <tr className="border-y border-pine/20">
                      <th
                        scope="col"
                        className="py-3.5 pr-2 text-[10.5px] font-medium tracking-[0.1em] text-ink-soft sm:text-[11px] sm:tracking-[0.16em]"
                      >
                        {t(admissions.tuitionHeaders.year)}
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pr-2 text-right text-[10.5px] font-medium tracking-[0.1em] text-ink-soft sm:text-[11px] sm:tracking-[0.16em]"
                      >
                        {t(admissions.tuitionHeaders.annual)}
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 text-right text-[10.5px] font-medium tracking-[0.1em] text-ink-soft sm:text-[11px] sm:tracking-[0.16em]"
                      >
                        {t(admissions.tuitionHeaders.split)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-pine/12 transition-colors hover:bg-paper-2/60"
                      >
                        <th
                          scope="row"
                          className="py-5 pr-2 text-left font-serif text-[14px] font-normal text-ink sm:text-[15.5px]"
                        >
                          {t(row.year)}
                        </th>
                        <td className="py-5 pr-2 text-right font-serif text-[15px] text-pine sm:text-[18px]">
                          {row.annual}
                        </td>
                        <td className="py-5 text-right text-[13px] text-ink-soft sm:text-[14px]">
                          {row.semester}
                          <span className="text-ink-soft/70">
                            {t(ui.semesterUnit)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[11.5px] leading-relaxed text-ink-soft/70">
                {t(ui.currency)} · LAK
              </p>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-4">
              <div className="bg-pine p-7 text-paper">
                <p className="text-[10.5px] tracking-[0.2em] text-gold">
                  {t(ui.totalLabel)}
                </p>
                <p className="mt-3 flex items-baseline gap-2 font-serif text-[28px] leading-none">
                  {admissions.total}
                  <span className="text-[12px] text-paper/60">LAK</span>
                </p>
                <div className="mt-6 h-px bg-paper/15" />
                <a
                  href="#contact"
                  className="mt-6 flex items-center justify-between border border-paper/25 px-4 py-3 text-[13px] text-paper transition-colors hover:border-paper/50 hover:bg-paper/5"
                >
                  {t(ui.applyOnline)}
                  <Icon name="arrowUpRight" className="h-4 w-4 opacity-70" />
                </a>
                <a
                  href="#welfare"
                  className="group mt-4 inline-flex items-center gap-2 text-[12px] text-gold/90 transition-colors hover:text-gold"
                >
                  {t(ui.scholarshipLink)} · {t(welfare.badge)}
                  <Icon name="arrow" className="arrow-shift h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 文档 2.5 Student Life & Photo Gallery（3 列网格 + Lightbox） */
function CampusLife() {
  const { t } = useLocale();

  return (
    <section
      id="campus"
      className="relative overflow-hidden bg-pine py-20 text-paper md:py-28"
    >
      <div className="pattern-lattice pointer-events-none absolute inset-0 text-paper/[0.06]" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-jade/25 blur-[120px]" />

      <div className="shell relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <p className="text-[11px] font-medium tracking-[0.26em] text-gold">
                {t(gallery.eyebrow)}
              </p>
            </div>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.35] text-paper">
              {t(gallery.title)}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-[12.5px] leading-relaxed text-paper/55">
              {t(ui.galleryHint)}
            </p>
          </Reveal>
        </div>

        <div className="mt-10 flex items-center gap-6">
          <p className="shrink-0 text-[11px] font-medium tracking-[0.24em] text-gold">
            {t(ui.galleryLabel)}
            <span className="ml-2.5 text-gold/45">GALLERY</span>
          </p>
          <span className="h-px flex-1 bg-paper/12" />
          <p className="shrink-0 text-[11px] text-paper/35">
            {gallery.items.length} {t(ui.galleryUnit)}
          </p>
        </div>

        <Gallery />
      </div>
    </section>
  );
}

/** 文档 2.6 Student Life & Welfare：奖学金 */
function Welfare() {
  const { t } = useLocale();

  return (
    <section id="welfare" className="bg-paper py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-cinnabar" />
              <p className="text-[11px] font-medium tracking-[0.26em] text-cinnabar">
                {t(welfare.eyebrow)}
              </p>
            </div>
            <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight text-pine">
              {t(welfare.title)}
            </h2>
          </div>

          <div className="flex items-end gap-4 border-l-2 border-cinnabar pl-5">
            <span className="font-serif text-[54px] leading-[0.85] text-pine">50</span>
            <span className="pb-1 text-[11.5px] leading-relaxed text-ink-soft">
              {t(welfare.badge)}
            </span>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-[13.5px] leading-[1.95] text-ink-soft">
          {t(welfare.intro)}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {welfare.items.map((s, i) => (
            <Reveal key={s.no} delay={i * 90}>
              <article className="group flex h-full flex-col border border-pine/12 bg-paper-2/50 p-7 transition-colors duration-300 hover:border-pine/30 hover:bg-paper-2">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center border border-pine/15 text-jade transition-colors duration-300 group-hover:border-cinnabar/45 group-hover:text-cinnabar">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-serif text-[12px] tracking-[0.18em] text-ink-soft/40">
                    {s.no}
                  </span>
                </div>

                <h3 className="mt-6 font-serif text-[19px] leading-snug text-ink">
                  {t(s.title)}
                </h3>

                <p className="mt-4 text-[13px] leading-[1.9] text-ink-soft">{t(s.desc)}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* 文档 2.6 附图：校方奖学金政策海报 */}
        <Reveal delay={120}>
          <div className="mt-10 grid grid-cols-1 gap-7 border border-pine/12 bg-paper-2/50 p-6 md:grid-cols-12 md:items-center md:gap-9 md:p-8">
            <div className="md:col-span-5">
              <a
                href={welfare.poster.src}
                target="_blank"
                rel="noreferrer"
                aria-label={t(welfare.poster.hint)}
                className="group block overflow-hidden border border-pine/10 bg-paper"
              >
                <Image
                  src={welfare.poster.src}
                  alt={t(welfare.poster.alt)}
                  width={940}
                  height={788}
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </a>
            </div>
            <div className="md:col-span-7">
              <p className="text-[11px] font-medium tracking-[0.22em] text-cinnabar">
                {t(ui.scholarshipLink)}
              </p>
              <h3 className="mt-3 font-serif text-[20px] leading-snug text-ink">
                {t(welfare.poster.label)}
              </h3>
              <p className="mt-3 max-w-xl text-[13.5px] leading-[1.95] text-ink-soft">
                {t(welfare.poster.caption)}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-[11px] tracking-[0.18em] text-ink-soft/70">
                  {t(welfare.poster.contactLabel)}
                </span>
                {[contact.phones[0], contact.phones[2]].map((phone) => (
                  <a
                    key={phone.value}
                    href={`tel:${phone.tel}`}
                    className="text-[13px] text-pine underline decoration-pine/25 underline-offset-4 transition-colors hover:decoration-pine"
                  >
                    {phone.value}
                  </a>
                ))}
              </div>
              <a
                href={welfare.poster.src}
                target="_blank"
                rel="noreferrer"
                className="group mt-6 inline-flex items-center gap-2 border border-pine/25 px-4 py-2.5 text-[12.5px] text-pine transition-colors hover:border-pine/50 hover:bg-paper"
              >
                {t(welfare.poster.hint)}
                <Icon
                  name="arrowUpRight"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** 文档 2.7 Contact Us */
function Contact() {
  const { locale, t } = useLocale();
  const addressLines = contact.addresses[locale] ?? contact.addresses.zh;

  const items: ContactItem[] = [
    {
      icon: "location",
      label: t(contact.labels.address),
      lines: addressLines,
      isAddress: true,
    },
    {
      icon: "phone",
      label: t(contact.labels.phone),
      lines: contact.phones.map((p) => ({ text: p.value, lang: "en", tel: p.tel })),
    },
    {
      icon: "public",
      label: t(contact.labels.facebook),
      lines: [{ text: contact.facebook.value, lang: "en" }],
      href: contact.facebook.href,
    },
  ];

  return (
    <section id="contact" className="border-t border-pine/10 bg-paper-2 py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-cinnabar" />
              <p className="text-[11px] font-medium tracking-[0.26em] text-cinnabar">
                {t(contact.eyebrow)}
              </p>
            </div>
            <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight text-pine">
              {t(contact.title)}
            </h2>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {items.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div className="flex gap-5 border-t border-pine/10 py-6 last:border-b">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center border border-pine/15 text-jade">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[11px] tracking-[0.18em] text-ink-soft/70">
                      {item.label}
                    </p>
                    <div className="mt-2 space-y-1">
                      {item.lines.map((line, j) => {
                        const tel = line.tel;
                        return (
                          <p
                            key={line.text}
                            lang={line.lang}
                            className={`text-[14px] leading-relaxed text-ink ${
                              line.lang === "lo"
                                ? "font-lao text-[13px] text-ink-soft"
                                : ""
                            } ${j > 0 && item.isAddress ? "text-[12.5px] text-ink-soft/75" : ""}`}
                          >
                            {tel ? (
                              <a
                                href={`tel:${tel}`}
                                className="transition-colors hover:text-jade"
                              >
                                {line.text}
                              </a>
                            ) : item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="transition-colors hover:text-jade"
                              >
                                {line.text}
                              </a>
                            ) : (
                              line.text
                            )}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="relative h-full bg-pine p-8 text-paper">
              <div className="pattern-lattice pointer-events-none absolute inset-0 text-paper/[0.05]" />
              <div className="relative">
                <p className="text-[10.5px] tracking-[0.2em] text-gold">
                  {t(announcement.schoolYear)}
                </p>
                <p className="mt-4 font-serif text-[19px] leading-snug">
                  {t(announcement.text)}
                </p>
                <p className="mt-4 text-[12.5px] leading-relaxed text-paper/60">
                  {t(announcement.deadline)}
                </p>
                <div className="mt-7 space-y-2.5">
                  {contact.phones.map((phone, i) => (
                    <a
                      key={phone.value}
                      href={`tel:${phone.tel}`}
                      className={
                        i === 0
                          ? "flex items-center justify-between bg-cinnabar px-4 py-3 text-[13px] text-white transition-colors hover:bg-[#a03f24]"
                          : "flex items-center justify-between border border-paper/25 px-4 py-3 text-[13px] transition-colors hover:border-paper/50 hover:bg-paper/5"
                      }
                    >
                      {phone.value}
                      <Icon
                        name="phone"
                        className={`h-4 w-4 ${i === 0 ? "opacity-80" : "opacity-60"}`}
                      />
                    </a>
                  ))}
                </div>

                <div className="mt-7 border-t border-paper/15 pt-6">
                  <a
                    href={contact.qr.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4"
                  >
                    <span className="shrink-0 bg-white p-2">
                      <Image
                        src={contact.qr.image}
                        alt={t(contact.qr.alt)}
                        width={200}
                        height={200}
                        className="h-[96px] w-[96px]"
                      />
                    </span>
                    <span className="block flex-1">
                      <span className="block font-serif text-[15px] text-paper">
                        {t(contact.qr.label)}
                      </span>
                      <span className="mt-1.5 block text-[11.5px] leading-relaxed text-paper/55">
                        {t(contact.qr.desc)}
                      </span>
                      <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-gold/90">
                        {t(contact.qr.cta)}
                        <Icon
                          name="arrowUpRight"
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </span>
                    </span>
                  </a>
                </div>

                <p className="mt-6 text-[11.5px] leading-relaxed text-paper/40">
                  {contact.addressEn}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * 常见问题
 * 用原生 <details> 实现折叠，不依赖 JS：爬虫与 AI 抓取时正文始终在 DOM 里。
 * 这同时是 FAQPage 结构化数据的内容来源，两边永远一致。
 */
function Faq() {
  const { t } = useLocale();

  return (
    <section id="faq" className="border-t border-pine/10 bg-paper py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-cinnabar">
            {t(faq.eyebrow).toUpperCase()}
          </p>
          <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)] leading-tight text-pine">
            {t(faq.title)}
          </h2>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-[1.9] text-ink-soft">
            {t(faq.intro)}
          </p>
        </Reveal>

        <div className="mt-10 border-t border-pine/12">
          {faq.items.map((item) => (
            <details key={item.q.zh} className="group border-b border-pine/12">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[15.5px] leading-[1.7] font-medium break-words text-pine">
                  {t(item.q)}
                </h3>
                <Icon
                  name="chevronDown"
                  className="mt-1 h-4 w-4 shrink-0 text-cinnabar transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="max-w-3xl pb-6 text-[14px] leading-[1.95] break-words text-ink-soft">
                {t(item.a)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <AnnouncementBand />
        <About />
        <Academics />
        <Admissions />
        <CampusLife />
        <Welfare />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
