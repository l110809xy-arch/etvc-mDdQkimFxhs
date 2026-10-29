import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { PageShell } from "@/components/page-shell";
import { isLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

/**
 * 老挝语 / 英文 / 韩文各自的独立地址（/lo、/en、/ko）。
 * 中文继续占用根路径，因此这里不再生成 zh。
 * 非法语言（如 /zh、/foo）由页面内的 notFound() 返回 404。
 */
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
  return buildMetadata(locale);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "zh") notFound();

  return (
    <PageShell locale={locale}>
      <HomePage />
    </PageShell>
  );
}
