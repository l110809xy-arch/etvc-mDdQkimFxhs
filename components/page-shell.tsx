import type { ReactNode } from "react";
import { ChatWidget } from "./chat-widget";
import { LocaleProvider } from "./locale-provider";
import type { Locale } from "@/lib/i18n";
import { buildJsonLd } from "@/lib/seo";

/**
 * 每个语言页面共用的外壳：
 * - 把路由上的语言注入 Provider，服务端渲染出来就是该语言的文案
 * - 把后台改过的文案覆盖值一并注入，改完刷新即生效
 * - 输出该语言对应的 JSON-LD 图
 *
 * 默认输出首页那套（机构 / 网站 / 网页 / 课程 / FAQ）；
 * 文章页有自己的 Article + BreadcrumbList + FAQPage，通过 jsonLd 覆盖，
 * 避免同一个页面出现两套互相矛盾的机构描述。
 */
export function PageShell({
  locale,
  overrides,
  jsonLd,
  children,
}: {
  locale: Locale;
  overrides?: Record<string, string>;
  jsonLd?: Record<string, unknown>;
  children: ReactNode;
}) {
  const payload = jsonLd ?? buildJsonLd(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(payload),
        }}
      />
      <LocaleProvider initialLocale={locale} overrides={overrides}>
        {children}
        <ChatWidget />
      </LocaleProvider>
    </>
  );
}
