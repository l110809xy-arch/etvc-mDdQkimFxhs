import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { RootDocument } from "@/components/root-document";
import { rootMetadata, rootViewport } from "@/lib/root-meta";

/**
 * 后台根布局。
 *
 * 一律 noindex：用 noindex 而不是在 robots.txt 里 disallow，
 * 因为 disallow 会让爬虫读不到 noindex，URL 仍可能被索引。
 */
export const metadata: Metadata = {
  ...rootMetadata,
  title: "管理后台 · ETVC",
  robots: { index: false, follow: false, nocache: true },
};
export const viewport: Viewport = rootViewport;

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument lang="zh-CN" locale="zh">
      {children}
    </RootDocument>
  );
}
