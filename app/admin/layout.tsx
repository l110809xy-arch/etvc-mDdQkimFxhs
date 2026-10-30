import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * 后台所有页面一律不进搜索引擎。
 *
 * 这里用 noindex 而不是在 robots.txt 里 disallow：
 * disallow 会阻止爬虫抓取，反而让它读不到 noindex，URL 仍可能被索引。
 * 后台本身由 middleware 拦截，未登录只会看到登录页，登录页带 noindex 即可。
 */
export const metadata: Metadata = {
  title: "管理后台 · ETVC",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
