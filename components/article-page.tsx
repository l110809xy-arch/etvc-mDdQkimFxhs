import { Icon } from "./icons";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import {
  articleUi,
  formatDate,
  getRelated,
  readingMinutes,
  type Article,
  type ArticleBlock,
} from "@/lib/articles";
import { localePath, type Locale } from "@/lib/i18n";
import { contact } from "@/lib/content";
import { articleIndexPath, articlePath } from "@/lib/seo";

/**
 * 文章详情页（服务端渲染，四种语言共用一套结构）。
 *
 * 版式按 GEO 的阅读顺序排：
 * 标题 → 一句话答案 → 数字/表格支撑 → 问答 → 行动入口。
 * 把答案放在最前面不是排版偏好，而是让 AI 抓取时第一段就能独立成句被摘录。
 */

function Block({ block, locale }: { block: ArticleBlock; locale: Locale }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-11 font-serif text-[21px] leading-snug text-ink md:text-[25px]">
          {block.text[locale]}
        </h2>
      );

    case "p":
      return (
        <p className="mt-4 text-[14.5px] leading-[1.95] text-ink/85 md:text-[15.5px]">
          {block.text[locale]}
        </p>
      );

    case "ul":
      return (
        <ul className="mt-4 space-y-2.5">
          {block.items.map((item) => (
            <li
              key={item[locale]}
              className="relative pl-5 text-[14.5px] leading-[1.9] text-ink/85 md:text-[15.5px]"
            >
              <span
                aria-hidden="true"
                className="absolute top-[0.72em] left-0 h-[5px] w-[5px] bg-cinnabar"
              />
              {item[locale]}
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        <figure className="mt-5">
          <div className="overflow-x-auto border border-pine/12">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="bg-pine-deep text-paper">
                  {block.head.map((cell) => (
                    <th
                      key={cell[locale]}
                      scope="col"
                      className="px-4 py-3 text-[12.5px] font-medium tracking-wide whitespace-nowrap"
                    >
                      {cell[locale]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr
                    key={row[0][locale]}
                    className="border-t border-pine/10 odd:bg-paper even:bg-paper-2/60"
                  >
                    {row.map((cell, i) => (
                      <td
                        key={`${cell[locale]}-${i}`}
                        className={`px-4 py-3 text-[13.5px] leading-relaxed tabular-nums ${
                          i === 0 ? "text-ink" : "text-ink/80"
                        }`}
                      >
                        {cell[locale]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption ? (
            <figcaption className="mt-2 text-[11.5px] leading-relaxed text-ink-soft/70">
              {block.caption[locale]}
            </figcaption>
          ) : null}
        </figure>
      );

    case "note":
      return (
        <aside className="mt-6 border-l-2 border-gold/60 bg-paper-2 px-4 py-3.5 text-[13px] leading-[1.85] text-ink/75 md:text-[13.5px]">
          {block.text[locale]}
        </aside>
      );
  }
}

export function ArticlePage({
  locale,
  article,
}: {
  locale: Locale;
  article: Article;
}) {
  const home = localePath(locale);
  const indexHref = articleIndexPath(locale);
  const related = getRelated(article);
  const minutes = readingMinutes(article, locale);

  return (
    <>
      <SiteHeader />

      <main id="top" className="bg-paper">
        {/* 面包屑：与 JSON-LD 的 BreadcrumbList 保持一致 */}
        <div className="border-b border-pine/10 bg-paper-2">
          <nav
            aria-label="Breadcrumb"
            className="shell flex flex-wrap items-center gap-x-2 gap-y-1 py-3.5 text-[11.5px] text-ink-soft"
          >
            <a href={home} className="transition-colors hover:text-pine">
              {articleUi.breadcrumbHome[locale]}
            </a>
            <span aria-hidden="true" className="text-ink-soft/40">
              /
            </span>
            <a href={indexHref} className="transition-colors hover:text-pine">
              {articleUi.indexEyebrow[locale]}
            </a>
            <span aria-hidden="true" className="text-ink-soft/40">
              /
            </span>
            <span className="line-clamp-1 text-ink/60">
              {article.title[locale]}
            </span>
          </nav>
        </div>

        <article className="shell mx-auto max-w-[760px] pt-12 pb-16 md:pt-16 md:pb-20">
          <header>
            <p className="text-[10.5px] tracking-[0.24em] text-cinnabar">
              {articleUi.indexEyebrow[locale]}
            </p>
            <h1 className="mt-3 font-serif text-[27px] leading-[1.35] text-ink md:text-[38px] md:leading-[1.3]">
              {article.title[locale]}
            </h1>
            <p className="mt-4 text-[11.5px] text-ink-soft/75">
              {articleUi.updated[locale]} {formatDate(article.updatedAt, locale)}
              <span aria-hidden="true" className="mx-2 text-ink-soft/35">
                ·
              </span>
              {minutes} {articleUi.minutes[locale]}
            </p>
          </header>

          {/* Answer First：整段可被 AI 直接摘录，也是读者第一眼要的结论 */}
          <div className="mt-8 border-l-[3px] border-cinnabar bg-paper-2 px-5 py-4 md:px-6 md:py-5">
            <p className="text-[9.5px] tracking-[0.24em] text-cinnabar/85">
              {articleUi.shortAnswer[locale]}
            </p>
            <p className="mt-2.5 text-[15px] leading-[1.9] text-ink md:text-[16.5px] md:leading-[1.85]">
              {article.answer[locale]}
            </p>
          </div>

          <div className="mt-2">
            {article.blocks.map((block, i) => (
              <Block key={`${block.type}-${i}`} block={block} locale={locale} />
            ))}
          </div>

          {/* FAQ：用原生 details，不依赖 JS，爬虫也能读到答案 */}
          {article.faq.length > 0 ? (
            <section className="mt-14">
              <h2 className="font-serif text-[21px] text-ink md:text-[25px]">
                {articleUi.faqTitle[locale]}
              </h2>
              <div className="mt-4 border-t border-pine/12">
                {article.faq.map((item) => (
                  <details
                    key={item.q[locale]}
                    className="group border-b border-pine/12 py-4"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[14.5px] leading-relaxed font-medium text-ink transition-colors hover:text-pine md:text-[15.5px]">
                      {item.q[locale]}
                      <Icon
                        name="chevronDown"
                        className="mt-1 h-4 w-4 shrink-0 text-ink-soft/50 transition-transform duration-300 group-open:rotate-180"
                      />
                    </summary>
                    <p className="mt-3 text-[14px] leading-[1.9] text-ink/80">
                      {item.a[locale]}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* 行动入口 */}
          <section className="mt-14 bg-pine-deep px-6 py-8 text-paper md:px-9 md:py-10">
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
          </section>

          {/* 内链：主题簇互链，帮 AI 建立「这一组文章讲同一件事」的判断 */}
          {related.length > 0 ? (
            <section className="mt-14">
              <h2 className="font-serif text-[19px] text-ink md:text-[22px]">
                {articleUi.relatedTitle[locale]}
              </h2>
              <ul className="mt-4 divide-y divide-pine/10 border-t border-pine/12">
                {related.map((item) => (
                  <li key={item.slug}>
                    <a
                      href={articlePath(locale, item.slug)}
                      className="group flex items-start justify-between gap-5 py-4 transition-colors hover:text-pine"
                    >
                      <span className="min-w-0">
                        <span className="block text-[14.5px] leading-snug font-medium text-ink transition-colors group-hover:text-pine">
                          {item.title[locale]}
                        </span>
                        <span className="mt-1.5 block text-[12.5px] leading-relaxed text-ink-soft/80">
                          {item.description[locale]}
                        </span>
                      </span>
                      <Icon
                        name="arrowUpRight"
                        className="mt-1 h-4 w-4 shrink-0 text-ink-soft/40 transition-colors group-hover:text-cinnabar"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-12">
            <a
              href={indexHref}
              className="inline-flex items-center gap-2 text-[13px] text-ink-soft transition-colors hover:text-pine"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
              {articleUi.backToIndex[locale]}
            </a>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
