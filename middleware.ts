import { NextResponse, type NextRequest } from "next/server";
import { locales } from "@/lib/i18n";

/**
 * 只允许已知的语言段作为第一层路径。
 *
 * 为什么需要这一层：项目启用了 cacheComponents（PPR），`[locale]` 的兜底路由在
 * 「某个未知路径第一次被访问」时会先返回 200 的静态壳、再流式输出 404 内容，
 * 也就是软 404 —— 对搜索引擎不友好。这里在路由层直接判定，任何情况下都是真 404。
 */
const KNOWN_FIRST_SEGMENT = new Set<string>(locales);

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,follow">
<title>页面不存在 404 | 民族职业技术学院 ETVC</title>
<style>
  :root{color-scheme:light}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:#f8f5ef;color:#0d3b35;
       font-family:"Noto Sans Lao","PingFang SC","Microsoft YaHei",system-ui,sans-serif;
       padding:24px;text-align:center}
  .k{font-size:11px;letter-spacing:.3em;color:#b84a2b}
  h1{margin:16px 0 0;font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.3}
  p{margin:16px 0 0;font-size:14.5px;line-height:1.9;color:#5c6b66}
  a{display:inline-block;margin-top:28px;padding:12px 24px;border-radius:999px;
    background:#0d3b35;color:#f8f5ef;text-decoration:none;font-size:14px}
  .langs{margin-top:28px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
  .langs a{background:transparent;color:#0d3b35;border:1px solid rgba(13,59,53,.2);
           padding:6px 14px;font-size:12.5px;margin:0}
</style>
</head>
<body>
<div>
  <p class="k">404</p>
  <h1>页面不存在</h1>
  <p>The page you are looking for does not exist.</p>
  <a href="/">返回首页 · Back to home</a>
  <div class="langs">
    <a href="/" lang="zh-CN">中文</a>
    <a href="/lo" lang="lo">ລາວ</a>
    <a href="/en" lang="en">English</a>
    <a href="/ko" lang="ko">한국어</a>
  </div>
</div>
</body>
</html>`;

export function middleware(request: NextRequest) {
  const first = request.nextUrl.pathname.split("/").filter(Boolean)[0];
  if (!first || KNOWN_FIRST_SEGMENT.has(first)) {
    return NextResponse.next();
  }

  return new NextResponse(NOT_FOUND_HTML, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-robots-tag": "noindex, follow",
    },
  });
}

export const config = {
  // 跳过 Next 内部资源、接口与带扩展名的静态文件（sitemap.xml / robots.txt / llms.txt 等）
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
