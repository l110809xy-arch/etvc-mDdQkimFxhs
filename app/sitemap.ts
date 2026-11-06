import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { locales, localeMeta, localePath } from "@/lib/i18n";
import {
  absoluteUrl,
  articleIndexPath,
  articlePath,
  languageAlternates,
} from "@/lib/seo";

/**
 * 四种语言各自一条记录，并通过 alternates.languages 互相声明 hreflang，
 * 让搜索引擎知道它们是同一页面的不同语言版本，而不是重复内容。
 *
 * 站点结构分三层：首页 → 问答列表 → 单篇文章。
 * 每层都带 hreflang，避免「中文文章页」和「英文文章页」被当成两个独立页面抢排名。
 */

/** 同一篇文章在四种语言下的地址 */
function articleLanguages(slug: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const code of locales) {
    map[localeMeta[code].htmlLang] = absoluteUrl(articlePath(code, slug));
  }
  map["x-default"] = absoluteUrl(articlePath("zh", slug));
  return map;
}

/** 问答列表页在四种语言下的地址 */
function indexLanguages(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const code of locales) {
    map[localeMeta[code].htmlLang] = absoluteUrl(articleIndexPath(code));
  }
  map["x-default"] = absoluteUrl(articleIndexPath("zh"));
  return map;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const homeLanguages = languageAlternates();
  const listLanguages = indexLanguages();

  const homePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: locale === "zh" ? 1 : 0.9,
    alternates: { languages: homeLanguages },
    images: [
      absoluteUrl("/images/campus-hero.jpg"),
      absoluteUrl("/images/logo.png"),
      absoluteUrl("/images/classroom.jpg"),
    ],
  }));

  const indexPages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: absoluteUrl(articleIndexPath(locale)),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: locale === "zh" ? 0.8 : 0.7,
    alternates: { languages: listLanguages },
  }));

  const articlePages: MetadataRoute.Sitemap = articles.flatMap((article) =>
    locales.map((locale) => ({
      url: absoluteUrl(articlePath(locale, article.slug)),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: locale === "zh" ? 0.7 : 0.6,
      alternates: { languages: articleLanguages(article.slug) },
      images: [absoluteUrl("/images/campus-hero.jpg")],
    })),
  );

  return [...homePages, ...indexPages, ...articlePages];
}
