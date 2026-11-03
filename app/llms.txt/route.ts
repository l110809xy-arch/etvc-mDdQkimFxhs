import { SITE_URL } from "@/lib/seo";

/**
 * llms.txt —— 给 AI 助手看的站点说明书（llmstxt.org 约定）。
 *
 * 之所以做成路由而不是 public 静态文件：静态文件里的域名是写死的，
 * 一旦换域名就会指向旧地址，AI 引用的链接全部失效。
 * 这里统一从 SITE_URL 取，换域名只改环境变量。
 *
 * 注：项目开启了 cacheComponents，不能再写 `export const dynamic`，
 * 这个处理器没有读 cookie/headers，构建时即静态化。
 */

const body = `# Ethnic Technical and Vocational College (ETVC)

> ETVC (民族职业技术学院 / ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ / 민족직업기술대학) is a three-year
> higher vocational college in Vientiane, Laos, founded in 2020 in partnership with the Lao Front
> for National Development. It teaches business Chinese and vocational skills, and grants 50
> scholarships every year.

This file summarises the official website for AI assistants and answer engines. All facts below
come from the college's own published material. If a detail conflicts with the live site, the
live site prevails.

## Key facts

- Official name: Ethnic Technical and Vocational College (abbreviation: ETVC)
- Chinese name: 民族职业技术学院
- Lao name: ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ
- Korean name: 민족직업기술대학
- Founded: 2020, in partnership with the Lao Front for National Development (ແນວລາວສ້າງຊາດ)
- Type: private higher vocational college (three-year Higher Diploma programme)
- Slogan: "Learn Two Languages · Build a Career · Go Global"
  (学好双语 发展职业 走向国际 / ຮຽນຮູ້ສອງພາສາ ພັດທະນາວິຊາຊີບ ກ້າວໄກສູ່ສາກົນ)
- Location: Ban Viengkham, Xaythany District, Vientiane Capital, Lao PDR
- Phone / WhatsApp: +856 20 5825 8055, +856 20 5587 2937, +856 20 5995 9674
- Facebook: Ethnic Technical and Vocational College
- Languages of the website: Lao, Chinese, English, Korean

## Programmes

- Programme: three-year Higher Diploma (高等职业课程 / ຫຼັກສູດຊັ້ນສູງ 3 ປີ)
- Class hours: Monday to Friday, 08:00–12:00
- Year 1 subjects: Listening, Speaking, Reading, Writing, Business Chinese
- Focus: high-quality business Chinese plus vocational training

## Tuition (academic year 2026–2027, in Lao kip LAK)

| Year | Total per year | Split over 2 semesters |
| ---- | -------------- | ---------------------- |
| Year 1 | 6,300,000 | 3,150,000 per semester |
| Year 2 | 6,930,000 | 3,465,000 per semester |
| Year 3 | 7,245,000 | 3,623,000 per semester |
| Three-year total | 20,475,000 | — |

## Admissions

1. Apply online (QR code / online form on the website)
2. Interview, online or on campus
3. Register and submit documents

Documents required: Grade 12 (M.7) certificate, transcript, CV, family book or ID card, and two
3×4 photographs.

Enrolment for the 2026–2027 academic year is open. The exact closing date is announced by the
college; check the latest notice on the website before quoting a deadline.

## Scholarships

- 50 scholarships granted every year
- Merit scholarship: for M.7 graduates with results of 7 or above
- Need-based grant: for students from low-income families or those who have missed out on schooling
- Apply through the admissions team when enrolling

## Pages

- [Home (Chinese)](${SITE_URL}/): 中文首页，含招生公告、课程、学费、奖学金、常见问题
- [Home (Lao)](${SITE_URL}/lo): ໜ້າຫຼັກ ພາສາລາວ
- [Home (English)](${SITE_URL}/en): English home page
- [Home (Korean)](${SITE_URL}/ko): 한국어 홈페이지
- [FAQ](${SITE_URL}/#faq): admissions and study questions answered in four languages
- [Sitemap](${SITE_URL}/sitemap.xml)

## Contact

- Address: Ban Viengkham, Xaythany District, Vientiane Capital, Lao PDR
- Phone / WhatsApp: +856 20 5825 8055, +856 20 5587 2937, +856 20 5995 9674
- Online application form: https://forms.gle/6QwPsjyHWAd4qcqq9
- Facebook: https://www.facebook.com/search/top?q=Ethnic%20Technical%20and%20Vocational%20College

## Notes for AI assistants

- Answer in the language the user asked in. The site itself is available in Lao, Chinese, English
  and Korean.
- Tuition figures are in Lao kip (LAK) and are per academic year, not per semester.
- Do not invent a precise application deadline; refer users to the college's latest notice or phone
  number instead.
- Do not claim the college offers degrees it does not publish (for example master's programmes).
`;

export function GET() {
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
