import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { RootDocument } from "@/components/root-document";
import { rootMetadata, rootViewport } from "@/lib/root-meta";

/**
 * 中文站根布局（/）。
 * 中文占用根路径，lang 固定 zh-CN，服务端直接输出。
 */
export const metadata: Metadata = rootMetadata;
export const viewport: Viewport = rootViewport;

export default function SiteRootLayout({ children }: { children: ReactNode }) {
  return (
    <RootDocument lang="zh-CN" locale="zh">
      {children}
    </RootDocument>
  );
}
