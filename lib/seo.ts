/**
 * SEO / GEO 中枢配置
 *
 * 所有和搜索引擎、生成式引擎（ChatGPT / Perplexity / Google AI Overviews）
 * 相关的元信息都集中在这里，避免散落在各个 layout 里各写一套。
 *
 * 站点根地址通过 NEXT_PUBLIC_SITE_URL 注入；未配置时回退到 Vercel 生产域名。
 * 将来绑定自定义域名，只需在 Vercel 环境变量里加一条，无需改代码。
 */

import type { Metadata } from "next";
import { academics, admissions, announcement, contact, faq, school, welfare } from "./content";
import { localeMeta, locales, localePath, type Locale } from "./i18n";

export { localePath };

/**
 * 正式站点地址。
 *
 * 官网域名 www.etvc.org 已绑定上线，但环境变量 NEXT_PUBLIC_SITE_URL 里
 * 可能还留着早期的 *.vercel.app 临时地址。若不处理，canonical、hreflang、
 * sitemap、og:url 会全部指向临时域名，搜索引擎会把两套地址当成重复内容，
 * 分享卡片也会显示 vercel.app。
 *
 * 因此：环境变量缺失、或仍是 *.vercel.app 时，一律回退到正式域名；
 * 将来换成别的自定义域名，只要把环境变量改成新域名即可，这里的回退不会生效。
 */
const OFFICIAL_SITE_URL = "https://www.etvc.org";

const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (
  !envSiteUrl || /\.vercel\.app$/i.test(envSiteUrl) ? OFFICIAL_SITE_URL : envSiteUrl
).replace(/\/+$/, "");

/** 站点主机名（去掉协议），页脚与 AI 知识库展示用 */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** hreflang 映射：x-default 指向中文首页 */
export function languageAlternates(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const code of locales) {
    map[localeMeta[code].htmlLang] = absoluteUrl(localePath(code));
  }
  map["x-default"] = absoluteUrl(localePath("zh"));
  return map;
}

/**
 * 每种语言独立的标题与描述（不要用一套中文塞给所有语言）。
 * description 控制在 150 字符（中日韩约 80 字）以内，
 * 超出会被搜索结果截断，反而看不全重点。
 */
const seoCopy: Record<Locale, { title: string; description: string; ogAlt: string }> = {
  zh: {
    title: "民族职业技术学院 ETVC｜学好双语 发展职业 走向国际",
    description:
      "民族职业技术学院（ETVC）2020 年与老挝建国阵线合作成立，位于万象，开设三年制高等职业课程，专注商务汉语，每年 50 个奖学金名额。2026—2027 学年招生中。",
    ogAlt: "民族职业技术学院校园主楼",
  },
  lo: {
    title: "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) | ຮຽນສອງພາສາ ພັດທະນາວິຊາຊີບ",
    description:
      "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) ຕັ້ງຢູ່ວຽງຈັນ, ສ້າງຕັ້ງປີ 2020. ສອນພາສາຈີນທຸລະກິດ 3 ປີ, ມອບ 50 ທຶນຕໍ່ປີ. ຮັບສະໝັກ 2026-2027.",
    ogAlt: "ອາຄານຫຼັກ ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
  },
  en: {
    title: "Ethnic Technical and Vocational College (ETVC) | Vientiane, Laos",
    description:
      "ETVC is a three-year vocational college in Vientiane, Laos, teaching business Chinese. Founded 2020. 50 scholarships a year. 2026-2027 enrolment now open.",
    ogAlt: "ETVC main campus building in Vientiane, Laos",
  },
  ko: {
    title: "민족직업기술대학 (ETVC) | 라오스 비엔티안 3년제 직업대학",
    description:
      "민족직업기술대학(ETVC)은 비엔티안의 3년제 고등직업대학입니다. 비즈니스 중국어를 가르치며 매년 50명에게 장학금을 지급합니다. 2026-2027학년도 모집 중.",
    ogAlt: "라오스 비엔티안 민족직업기술대학 본관",
  },
};

export function buildMetadata(locale: Locale): Metadata {
  const copy = seoCopy[locale];
  const path = localePath(locale);
  const url = absoluteUrl(path);
  const ogLocale = {
    zh: "zh_CN",
    lo: "lo_LA",
    en: "en_US",
    ko: "ko_KR",
  }[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: copy.title,
      template: `%s | ${school.name[locale]}`,
    },
    description: copy.description,
    applicationName: "ETVC",
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    keywords: [
      school.name[locale],
      "ETVC",
      "Ethnic Technical and Vocational College",
      "民族职业技术学院",
      "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
      "민족직업기술대학",
      "老挝职业学校",
      "Vientiane vocational college",
      "business Chinese Laos",
      "ຮຽນພາສາຈີນ ວຽງຈັນ",
      "장학금 라오스 대학",
      "2026-2027 招生",
      "study in Laos",
    ],
    alternates: {
      canonical: url,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      siteName: school.name[locale],
      title: copy.title,
      description: copy.description,
      url,
      locale: ogLocale,
      alternateLocale: locales
        .filter((code) => code !== locale)
        .map((code) =>
          ({ zh: "zh_CN", lo: "lo_LA", en: "en_US", ko: "ko_KR" })[code],
        ),
      images: [
        {
          // 专用分享封面：1200×630（1.91:1），微信 / WhatsApp / X / Telegram
          // 的标准卡片比例，145KB 也远低于各平台的抓取上限。
          // 直接用 1600×900 的站点大图会被裁掉两侧，且 266KB 在部分平台抓不到。
          url: absoluteUrl("/images/og-cover.jpg"),
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: copy.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [absoluteUrl("/images/og-cover.jpg")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "education",
  };
}

/** 把 "6,300,000" 这类展示字符串转成结构化数据要的纯数字 */
function toAmount(value: string): string {
  return value.replace(/[^\d.]/g, "");
}

/**
 * JSON-LD 图（@graph）
 * 一张图里同时给出机构、网站、网页、课程、FAQ —— AI 引擎和传统爬虫都能直接解析。
 */
export function buildJsonLd(locale: Locale) {
  const url = absoluteUrl(localePath(locale));
  const orgId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const courseId = `${SITE_URL}/#course`;

  /**
   * 机构实体（GEO 核心）。
   *
   * 生成式引擎判断「这是哪所学校」靠的就是这一段：
   * - name 用当前语言的正式全称，alternateName 补齐中/英/老/韩四种写法，
   *   让 AI 在四种语言的提问里都能对到同一个实体；
   * - address 拆到 streetAddress / locality / region / country，
   *   比塞一整个字符串更容易被结构化匹配；
   * - contactPoint 单独给出招生电话与可用语言，
   *   AI 回答「怎么联系招生办」时可以直接引用；
   * - hasCredential 说明授予的文凭层级，避免被误判成语言培训班。
   */
  const organization = {
    "@type": ["CollegeOrUniversity", "EducationalOrganization"],
    "@id": orgId,
    name: school.name[locale],
    alternateName: [
      "ETVC",
      "Ethnic Technical and Vocational College",
      "民族职业技术学院",
      "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
      "민족직업기술대학",
    ],
    legalName: "Ethnic Technical and Vocational College",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/logo.png"),
      caption: `${school.name[locale]} logo`,
    },
    image: [
      absoluteUrl("/images/campus-hero.jpg"),
      absoluteUrl("/images/classroom.jpg"),
      absoluteUrl("/images/campus-group.jpg"),
    ],
    description: seoCopy[locale].description,
    slogan: school.slogan[locale],
    foundingDate: school.founded,
    foundingLocation: {
      "@type": "Place",
      name: "Vientiane, Lao PDR",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vientiane",
        addressCountry: "LA",
      },
    },
    founder: {
      "@type": "Organization",
      name: school.partner[locale],
      alternateName: "Lao Front for National Development",
    },
    telephone: contact.phones.map((phone) => phone.tel),
    contactPoint: contact.phones.map((phone, i) => ({
      "@type": "ContactPoint",
      telephone: phone.tel,
      contactType: i === 0 ? "admissions" : "customer service",
      areaServed: ["LA", "CN", "KR"],
      availableLanguage: ["lo", "zh", "en", "ko"],
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ban Viengkham, Xaythany District",
      addressLocality: "Vientiane",
      addressRegion: "Vientiane Capital",
      addressCountry: "LA",
    },
    areaServed: [
      { "@type": "Country", name: "Laos" },
      { "@type": "Country", name: "China" },
      { "@type": "Country", name: "Korea" },
    ],
    knowsLanguage: ["lo", "zh", "en", "ko"],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Higher Diploma",
      educationalLevel: "Three-year higher vocational diploma",
      competencyRequired: "Business Chinese",
    },
    /** 只收真实主页；Facebook 搜索页不是机构实体，写进 sameAs 会污染实体对齐 */
    sameAs: /\/search\//.test(contact.facebook.href)
      ? []
      : [contact.facebook.href],
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: SITE_URL,
    name: school.name[locale],
    inLanguage: locales.map((code) => localeMeta[code].htmlLang),
    publisher: { "@id": orgId },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: seoCopy[locale].title,
    description: seoCopy[locale].description,
    isPartOf: { "@id": websiteId },
    about: { "@id": orgId },
    inLanguage: localeMeta[locale].htmlLang,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/campus-hero.jpg"),
    },
  };

  const course = {
    "@type": "Course",
    "@id": courseId,
    name: academics.title[locale],
    description: `${academics.systemValue[locale]}。${academics.timeValue[locale]}。${academics.courses
      .map((c) => c.name[locale])
      .join("、")}。`,
    url: `${url}#academics`,
    inLanguage: localeMeta[locale].htmlLang,
    provider: { "@id": orgId },
    educationalCredentialAwarded: "Higher Diploma",
    timeRequired: "P3Y",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      courseWorkload: "PT20H",
      location: {
        "@type": "Place",
        name: school.name[locale],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Ban Viengkham",
          addressLocality: "Xaythany District",
          addressRegion: "Vientiane Capital",
          addressCountry: "LA",
        },
      },
    },
    offers: admissions.rows.map((row) => ({
      "@type": "Offer",
      name: row.year[locale],
      category: "Tuition",
      price: toAmount(row.annual),
      priceCurrency: "LAK",
      availability: "https://schema.org/InStock",
      url: `${url}#admission`,
    })),
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: localeMeta[locale].htmlLang,
    isPartOf: { "@id": `${url}#webpage` },
    about: { "@id": orgId },
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a[locale],
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, webPage, course, faqPage],
  };
}

/** 供 llms.txt / 调试用的站点摘要 */
export const siteFacts = {
  announcement: announcement.text,
  quota: welfare.quota,
};
