import type { Metadata } from "next";
import "./globals.css";
import { ChatWidget } from "@/components/chat-widget";
import { LocaleProvider } from "@/components/locale-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.etvc.la"),
  title: {
    default: "民族职业技术学院 ETVC｜学好双语 发展职业 走向国际",
    template: "%s | 民族职业技术学院 ETVC",
  },
  description:
    "民族职业技术学院（Ethnic Technical and Vocational College，ETVC）于 2020 年与老挝建国阵线合作成立，位于万象市赛塔尼县，开设三年制高等职业专科课程，专注高质量商务汉语教学与职业教育，每年提供 50 个奖学金名额。",
  keywords: [
    "ETVC",
    "民族职业技术学院",
    "老挝职业学校",
    "商务汉语",
    "万象",
    "职业教育",
    "2026-2027 招生",
    "老挝留学",
    "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
    "민족직업기술대학",
  ],
  openGraph: {
    title: "民族职业技术学院 ETVC｜学中文开拓新视野",
    description: "学好双语 发展职业 走向国际 —— 2026—2027 学年三年制高等职业课程招生中。",
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["lo_LA", "en_US", "ko_KR"],
    images: ["/images/campus-hero.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  name: "Ethnic Technical and Vocational College",
  alternateName: [
    "ETVC",
    "民族职业技术学院",
    "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
    "민족직업기술대학",
  ],
  url: "https://www.etvc.la",
  logo: "https://www.etvc.la/images/logo.png",
  image: "https://www.etvc.la/images/campus-hero.jpg",
  description:
    "A three-year higher vocational college in Vientiane, Laos, focusing on business Chinese and vocational education, founded in 2020 with the Lao Front for National Development.",
  foundingDate: "2020",
  telephone: "+8562058258055",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ban Viengkham",
    addressLocality: "Xaythany District",
    addressRegion: "Vientiane Capital",
    addressCountry: "LA",
  },
  sameAs: ["https://www.facebook.com/"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" data-locale="zh" className="h-full" suppressHydrationWarning>
      <head>
        {/* 首屏前同步已保存的语言，避免字体与文案闪变 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.classList.add('js');var l=localStorage.getItem('etvc-locale');var m={lo:'lo',zh:'zh-CN',en:'en',ko:'ko'};if(l&&m[l]){document.documentElement.setAttribute('data-locale',l);document.documentElement.setAttribute('lang',m[l]);}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          {children}
          <ChatWidget />
        </LocaleProvider>
      </body>
    </html>
  );
}
