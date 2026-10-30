import type { ReactNode } from "react";

/**
 * 三个根布局共用的 <html> / <head> / <body> 骨架。
 *
 * 关键点：lang 与 data-locale 由各根布局按当前语言「服务端直接写死」，
 * 不再依赖客户端脚本回填。这样即使爬虫不执行 JS（多数 AI 爬虫如此），
 * 读到的也是正确的语言标记；屏幕阅读器也不会用错误发音朗读。
 */
export function RootDocument({
  lang,
  locale,
  children,
}: {
  lang: string;
  locale: string;
  children: ReactNode;
}) {
  return (
    <html lang={lang} data-locale={locale} className="h-full" suppressHydrationWarning>
      {/* App Router 没有 next/head，这里需要一段首屏前同步执行的内联脚本 */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/*
          唯一的客户端前置动作：打上 js 类。
          无 JS 时滚动入场动画的元素会保持可见，不会出现空白页。
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.classList.add('js')}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
