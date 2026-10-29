import { HomePage } from "@/components/home-page";
import { PageShell } from "@/components/page-shell";
import { buildMetadata } from "@/lib/seo";

/** 中文首页固定在根路径，已分享出去的链接保持不变 */
export const metadata = buildMetadata("zh");

export default function Page() {
  return (
    <PageShell locale="zh">
      <HomePage />
    </PageShell>
  );
}
