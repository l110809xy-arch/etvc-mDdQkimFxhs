import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

/**
 * 四种语言各自一条记录，并通过 alternates.languages 互相声明 hreflang，
 * 让搜索引擎知道它们是同一页面的不同语言版本，而不是重复内容。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = languageAlternates();

  return locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: locale === "zh" ? 1 : 0.9,
    alternates: { languages },
    images: [
      absoluteUrl("/images/campus-hero.jpg"),
      absoluteUrl("/images/logo.png"),
      absoluteUrl("/images/classroom.jpg"),
    ],
  }));
}
