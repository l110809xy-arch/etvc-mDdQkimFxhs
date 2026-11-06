import { Icon } from "./icons";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import {
  articleUi,
  articles,
  formatDate,
  readingMinutes,
} from "@/lib/articles";
import { contact } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { articlePath } from "@/lib/seo";

/**
 * 问答列表页。
 *
 * 除了给人看，这一页也是 GEO 的「主题簇入口」：
 * ItemList 结构化数据 + 每张卡片的完整摘要，让 AI 一次就能拿到全部问题清单，
 * 不必逐篇抓取才知道站点覆盖了哪些招生话题。
 */
export function ArticleIndex({ locale }: { locale: Locale }) {
  const home = localePath(locale);

  return (
    <>
      <SiteHeader />

      <main id="top" className="bg-paper">
        <section className="border-b border-pine/10 bg-paper-2">
          <div className="shell mx-auto max-w-[760px] py-14 md:py-20">
            <p className="text-[10.5px] tracking-[0.24em] text-cinnabar">
              {articleUi.indexEyebrow[locale]}
            </p>
            <h1 className="mt-3 font-serif text-[27px] leading-[1.35] text-ink md:text-[38px] md:leading-[1.3]">
              {articleUi.indexTitle[locale]}
            </h1>
            <p className="mt-4 max-w-[62ch] text-[14px] leading-[1.9] text-ink/75 md:text-[15px]">
              {articleUi.indexLead[locale]}
            </p>
          </div>
        </section>

        <section className="shell mx-auto max-w-[760px] py-12 md:py-16">
          <ul className="border-t border-pine/12">
            {articles.map((article) => (
              <li key={article.slug}>
                <a
                  href={articlePath(locale, article.slug)}
                  className="group block border-b border-pine/12 py-7 transition-colors md:py-8"
                >
                  <p className="flex flex-wrap items-center gap-2 text-[11px] text-ink-soft/70">
                    <span>{formatDate(article.publishedAt, locale)}</span>
                    <span aria-hidden="true" className="text-ink-soft/35">
                      ·
                    </span>
                    <span>
                      {readingMinutes(article, locale)}{" "}
                      {articleUi.minutes[locale]}
                    </span>
                  </p>
                  <h2 className="mt-2.5 font-serif text-[20px] leading-snug text-ink transition-colors group-hover:text-pine md:text-[24px]">
                    {article.title[locale]}
                  </h2>
                  <p className="mt-2.5 max-w-[62ch] text-[13.5px] leading-[1.85] text-ink/70 md:text-[14px]">
                    {article.description[locale]}
                  </p>
                  <span className="mt-3.5 inline-flex items-center gap-1.5 text-[12.5px] text-cinnabar">
                    {articleUi.readArticle[locale]}
                    <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 bg-pine-deep px-6 py-8 text-paper md:px-9 md:py-10">
            <h2 className="font-serif text-[19px] leading-snug md:text-[23px]">
              {articleUi.ctaTitle[locale]}
            </h2>
            <p className="mt-2.5 max-w-[46ch] text-[13px] leading-relaxed text-paper/65">
              {articleUi.ctaBody[locale]}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={`${home}#apply`}
                className="inline-flex items-center gap-2 bg-cinnabar px-5 py-2.5 text-[13px] font-medium tracking-wide text-white transition-colors hover:bg-[#a03f24]"
              >
                {articleUi.ctaApply[locale]}
                <Icon name="arrowUpRight" className="h-4 w-4" />
              </a>
              <a
                href={`tel:${contact.phones[0].tel}`}
                className="inline-flex items-center gap-2 border border-paper/25 px-4 py-2.5 text-[13px] text-paper/85 transition-colors hover:border-paper/50 hover:text-paper"
              >
                <Icon name="phone" className="h-3.5 w-3.5" />
                {articleUi.ctaCall[locale]}
              </a>
            </div>
          </div>

          <div className="mt-10">
            <a
              href={home}
              className="inline-flex items-center gap-2 text-[13px] text-ink-soft transition-colors hover:text-pine"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
              {articleUi.breadcrumbHome[locale]}
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
