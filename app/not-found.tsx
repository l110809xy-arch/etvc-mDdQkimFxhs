import Link from "next/link";
import type { Metadata } from "next";
import { locales, localeMeta } from "@/lib/i18n";
import { localePath } from "@/lib/seo";

export const metadata: Metadata = {
  title: "页面不存在 404 | 民族职业技术学院 ETVC",
  description: "你访问的页面不存在，请返回首页。",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-paper px-5 py-24">
      <div className="w-full max-w-xl text-center">
        <p className="text-[11px] tracking-[0.3em] text-cinnabar">404</p>
        <h1 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-pine">
          页面不存在
        </h1>
        <p className="mt-4 text-[14.5px] leading-[1.9] text-ink-soft">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-[14px] text-paper transition-opacity hover:opacity-90"
        >
          返回首页 · Back to home
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={localePath(locale)}
              lang={localeMeta[locale].htmlLang}
              className="rounded-full border border-pine/20 px-3.5 py-1.5 text-[12.5px] text-pine transition-colors hover:border-pine/45 hover:bg-paper-2"
            >
              {localeMeta[locale].native}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
