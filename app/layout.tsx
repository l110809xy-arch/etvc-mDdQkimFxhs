import type { Metadata, Viewport } from "next";
import "./globals.css";

/**
 * 根布局只负责 html/body 骨架。
 * 各语言页面的 metadata 与 LocaleProvider 分别由 app/page.tsx 和
 * app/[locale]/page.tsx 提供，这样每种语言都有独立的 title / description / canonical。
 */

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://etvc-website.vercel.app",
  ),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d3b35",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" data-locale="zh" className="h-full" suppressHydrationWarning>
      <head>
        {/*
          首屏前同步两件事：
          1. 打上 js 类，避免无 JS 时滚动动画元素被隐藏
          2. 按当前路径把语言写回 <html>（根布局拿不到路由参数，
             这里在首次绘制前补上，保证 lang 与 data-locale 与页面内容一致）
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;d.classList.add('js');var p=location.pathname.split('/')[1];var m={lo:'lo',en:'en',ko:'ko'};if(m[p]){d.setAttribute('data-locale',p);d.setAttribute('lang',p);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
