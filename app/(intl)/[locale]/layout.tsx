import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { RootDocument } from "@/components/root-document";
import { rootMetadata, rootViewport } from "@/lib/root-meta";
import { isLocale, localeMeta } from "@/lib/i18n";

/**
 * 老挝语 / 英文 / 韩文站的根布局（/lo、/en、/ko）。
 *
 * 这里是修好 <html lang> 的关键：根布局能拿到 [locale] 路由参数，
 * 所以 lang 与 data-locale 在服务端就写对了，不再靠客户端脚本回填。
 */
export const metadata: Metadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export default async function IntlRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const code = isLocale(locale) ? locale : "zh";

  return (
    <RootDocument lang={localeMeta[code].htmlLang} locale={code}>
      {children}
    </RootDocument>
  );
}
