import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { PageShell } from "@/components/page-shell";
import { articleSlugs, getArticle } from "@/lib/articles";
import { loadOverrides } from "@/lib/overrides";
import { buildArticleJsonLd, buildArticleMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return articleSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return buildArticleMetadata("zh", article);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const overrides = await loadOverrides();

  return (
    <PageShell
      locale="zh"
      overrides={overrides}
      jsonLd={buildArticleJsonLd("zh", article)}
    >
      <ArticlePage locale="zh" article={article} />
    </PageShell>
  );
}
