import type { ReactNode } from "react";
import { ChatWidget } from "./chat-widget";
import { LocaleProvider } from "./locale-provider";
import type { Locale } from "@/lib/i18n";
import { buildJsonLd } from "@/lib/seo";

/**
 * 每个语言页面共用的外壳：
 * - 把路由上的语言注入 Provider，服务端渲染出来就是该语言的文案
 * - 输出该语言对应的 JSON-LD 图（机构 / 网站 / 网页 / 课程 / FAQ）
 */
export function PageShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(locale)),
        }}
      />
      <LocaleProvider initialLocale={locale}>
        {children}
        <ChatWidget />
      </LocaleProvider>
    </>
  );
}
