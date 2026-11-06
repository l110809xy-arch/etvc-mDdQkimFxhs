import type { Metadata } from "next";
import { ArticleIndex } from "@/components/article-index";
import { PageShell } from "@/components/page-shell";
import { articles } from "@/lib/articles";
import { loadOverrides } from "@/lib/overrides";
import {
  buildArticleIndexJsonLd,
  buildArticleIndexMetadata,
} from "@/lib/seo";

/** 中文问答列表固定在 /blog（中文占根路径，不带 /zh 前缀） */
export const metadata: Metadata = buildArticleIndexMetadata("zh");

export default async function Page() {
  const overrides = await loadOverrides();

  return (
    <PageShell
      locale="zh"
      overrides={overrides}
      jsonLd={buildArticleIndexJsonLd("zh", articles)}
    >
      <ArticleIndex locale="zh" />
    </PageShell>
  );
}
