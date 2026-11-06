import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { PageShell } from "@/components/page-shell";
import { articles, getArticle } from "@/lib/articles";
import { isLocale, locales } from "@/lib/i18n";
import { loadOverrides } from "@/lib/overrides";
import { buildArticleJsonLd, buildArticleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== "zh")
    .flatMap((locale) => articles.map((article) => ({ locale, slug: article.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === "zh") return {};
  const article = getArticle(slug);
  if (!article) return {};
  return buildArticleMetadata(locale, article);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === "zh") notFound();

  const article = getArticle(slug);
  if (!article) notFound();

  const overrides = await loadOverrides();

  return (
    <PageShell
      locale={locale}
      overrides={overrides}
      jsonLd={buildArticleJsonLd(locale, article)}
    >
      <ArticlePage locale={locale} article={article} />
    </PageShell>
  );
}
