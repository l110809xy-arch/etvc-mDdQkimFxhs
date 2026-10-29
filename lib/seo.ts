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

/** 站点根地址（不带结尾斜杠） */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://etvc-website.vercel.app"
).replace(/\/+$/, "");

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

/** 每种语言独立的标题与描述（不要用一套中文塞给所有语言） */
const seoCopy: Record<Locale, { title: string; description: string; ogAlt: string }> = {
  zh: {
    title: "民族职业技术学院 ETVC｜学好双语 发展职业 走向国际",
    description:
      "民族职业技术学院（ETVC）2020 年与老挝建国阵线合作成立，位于万象市赛塔尼县，开设三年制高等职业课程，专注商务汉语与职业教育，每年提供 50 个奖学金名额。2026—2027 学年招生中。",
    ogAlt: "民族职业技术学院校园主楼",
  },
  lo: {
    title: "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) | ຮຽນສອງພາສາ ພັດທະນາວິຊາຊີບ",
    description:
      "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) ສ້າງຕັ້ງປີ 2020 ຮ່ວມກັບແນວລາວສ້າງຊາດ ຕັ້ງຢູ່ເມືອງໄຊທານີ ນະຄອນຫຼວງວຽງຈັນ, ເປີດສອນຫຼັກສູດຊັ້ນສູງ 3 ປີ ສຸມໃສ່ພາສາຈີນທຸລະກິດ ແລະ ວິຊາຊີບ, ມອບທຶນການສຶກສາ 50 ທຶນຕໍ່ປີ.",
    ogAlt: "ອາຄານຫຼັກ ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
  },
  en: {
    title: "Ethnic Technical and Vocational College (ETVC) | Vientiane, Laos",
    description:
      "ETVC is a three-year higher vocational college in Vientiane, Laos, founded in 2020 with the Lao Front for National Development. Business Chinese and vocational programmes, 50 scholarships per year. Enrolment open for 2026-2027.",
    ogAlt: "ETVC main campus building in Vientiane, Laos",
  },
  ko: {
    title: "민족직업기술대학 (ETVC) | 라오스 비엔티안 3년제 직업대학",
    description:
      "민족직업기술대학(ETVC)은 2020년 라오스건국전선과 함께 설립된 비엔티안의 3년제 고등직업대학입니다. 비즈니스 중국어와 직업 교육을 제공하며 매년 50명에게 장학금을 지급합니다. 2026-2027학년도 신입생 모집 중.",
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
          url: absoluteUrl("/images/campus-hero.jpg"),
          width: 1600,
          height: 900,
          alt: copy.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [absoluteUrl("/images/campus-hero.jpg")],
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
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/logo.png"),
      caption: `${school.name[locale]} logo`,
    },
    image: absoluteUrl("/images/campus-hero.jpg"),
    description: seoCopy[locale].description,
    slogan: school.slogan[locale],
    foundingDate: school.founded,
    founder: { "@type": "Organization", name: school.partner[locale] },
    telephone: contact.phones.map((phone) => phone.tel),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ban Viengkham",
      addressLocality: "Xaythany District",
      addressRegion: "Vientiane Capital",
      addressCountry: "LA",
    },
    areaServed: [
      { "@type": "Country", name: "Laos" },
      { "@type": "Country", name: "China" },
      { "@type": "Country", name: "Korea" },
    ],
    knowsLanguage: ["lo", "zh", "en", "ko"],
    sameAs: [contact.facebook.href],
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
