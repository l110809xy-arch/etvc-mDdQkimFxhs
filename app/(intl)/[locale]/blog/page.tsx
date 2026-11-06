import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleIndex } from "@/components/article-index";
import { PageShell } from "@/components/page-shell";
import { articles } from "@/lib/articles";
import { isLocale, locales } from "@/lib/i18n";
import { loadOverrides } from "@/lib/overrides";
import {
  buildArticleIndexJsonLd,
  buildArticleIndexMetadata,
} from "@/lib/seo";

/** 老挝语 / 英文 / 韩文的问答列表（/lo/blog、/en/blog、/ko/blog） */
export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== "zh")
    .map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildArticleIndexMetadata(locale);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "zh") notFound();

  const overrides = await loadOverrides();

  return (
    <PageShell
      locale={locale}
      overrides={overrides}
      jsonLd={buildArticleIndexJsonLd(locale, articles)}
    >
      <ArticleIndex locale={locale} />
    </PageShell>
  );
}
