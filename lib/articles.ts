/**
 * GEO 内容库：答案型文章
 *
 * 生成式引擎（ChatGPT / Perplexity / Google AI Overviews / 百度 AI）不按关键词
 * 密度取内容，它找「可以直接摘出来当答案」的段落。因此每篇都必须满足四条硬规则：
 *
 * 1. Answer First —— answer 字段就是完整答案，40–80 字，可独立成段被摘录；
 * 2. Quantified Facts —— 至少 3 个具体数字（学费、名额、学制、课时）；
 * 3. Table Support —— 价格 / 对比 / 流程一律用 table 区块，不用段落堆数字；
 * 4. Entity Consistency —— 校名四语写法、地址、电话与 lib/seo.ts 的 JSON-LD 完全一致。
 *
 * ⚠️ 事实红线：所有数字只能来自 lib/content.ts 的既有字段（见 docs/geo-content-plan.md
 * 的「事实基线」）。官网没有公布的（住宿费、教材费、确切报名截止日）一律不写具体值，
 * 改为引导读者致电招生办 —— 编造数字是 GEO 最快翻车的方式，AI 一旦引用错误信息，
 * 学校要花几倍力气纠正。
 */

import { L, type Locale, type Localized } from "./i18n";
import { ARTICLE_SLUGS } from "./article-slugs";
import { admissions, contact, welfare } from "./content";

export type ArticleBlock =
  | { type: "h2"; text: Localized }
  | { type: "p"; text: Localized }
  | { type: "ul"; items: Localized[] }
  | { type: "table"; head: Localized[]; rows: Localized[][]; caption?: Localized }
  | { type: "note"; text: Localized };

export type ArticleFaq = { q: Localized; a: Localized };

export type Article = {
  slug: string;
  /** ISO 日期，用于 Article schema 的 datePublished / dateModified */
  publishedAt: string;
  updatedAt: string;
  title: Localized;
  /** 搜索结果里的描述，控制在 150 字符内 */
  description: Localized;
  /** Answer First：首段直接给结论 */
  answer: Localized;
  blocks: ArticleBlock[];
  faq: ArticleFaq[];
  /** 相关文章 slug，用于内链（GEO 里内链帮助 AI 建立主题簇） */
  related: string[];
};

/** 学费表直接复用 admissions.rows，避免两处数字打架 */
const tuitionRows: Localized[][] = admissions.rows.map((row) => [
  row.year,
  L(row.annual, row.annual, row.annual, row.annual),
  L(row.semester, row.semester, row.semester, row.semester),
]);

const tuitionHead: Localized[] = [
  admissions.tuitionHeaders.year,
  admissions.tuitionHeaders.annual,
  admissions.tuitionHeaders.split,
];

const phone = contact.phones[0].value;

export const articles: Article[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. 学费（搜索意图最强：所有家长第一句问的都是「多少钱」）
  // ─────────────────────────────────────────────────────────────
  {
    slug: "etvc-tuition",
    publishedAt: "2026-11-06",
    updatedAt: "2026-11-06",
    title: L(
      "ETVC 学费多少？三年一共多少钱？",
      "How much does ETVC cost? Tuition for all three years",
      "ຄ່າຮຽນ ETVC ເທົ່າໃດ? ລວມ 3 ປີເທົ່າໃດ?",
      "ETVC 등록금은 얼마인가요? 3년 총액",
    ),
    description: L(
      "2026—2027 学年 ETVC 三年制高等职业课程学费：第一年 6,300,000 基普、第二年 6,930,000、第三年 7,245,000，三年合计 20,475,000 基普，可分两学期缴。",
      "ETVC tuition for 2026-2027 is LAK 6,300,000 in Year 1, 6,930,000 in Year 2 and 7,245,000 in Year 3 — LAK 20,475,000 in total, payable in two terms a year.",
      "ຄ່າຮຽນ ETVC ປີການສຶກສາ 2026-2027: ປີທີ 1 6,300,000 ກີບ, ປີທີ 2 6,930,000 ກີບ, ປີທີ 3 7,245,000 ກີບ, ລວມ 20,475,000 ກີບ, ແບ່ງຈ່າຍ 2 ເທີມຕໍ່ປີ.",
      "2026-2027학년도 ETVC 등록금은 1학년 6,300,000킵, 2학년 6,930,000킵, 3학년 7,245,000킵으로 3년 총 20,475,000킵이며 연 2회 분납할 수 있습니다.",
    ),
    answer: L(
      "2026—2027 学年，民族职业技术学院（ETVC）三年制高等职业课程学费为：第一学年 6,300,000 基普、第二学年 6,930,000 基普、第三学年 7,245,000 基普，三年合计 20,475,000 基普。每学年可分成 2 个学期缴纳。",
      "For the 2026-2027 academic year, tuition at Ethnic Technical and Vocational College (ETVC) is LAK 6,300,000 for Year 1, LAK 6,930,000 for Year 2 and LAK 7,245,000 for Year 3 — LAK 20,475,000 in total. Each year can be paid in two termly instalments.",
      "ສຳລັບປີການສຶກສາ 2026-2027, ຄ່າຮຽນຫຼັກສູດຊັ້ນສູງ 3 ປີ ຂອງວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) ແມ່ນ ປີທີ 1 6,300,000 ກີບ, ປີທີ 2 6,930,000 ກີບ, ປີທີ 3 7,245,000 ກີບ, ລວມທັງໝົດ 20,475,000 ກີບ. ແຕ່ລະປີແບ່ງຈ່າຍໄດ້ 2 ເທີມ.",
      "2026-2027학년도 민족직업기술대학(ETVC) 3년제 고등직업과정 등록금은 1학년 6,300,000킵, 2학년 6,930,000킵, 3학년 7,245,000킵으로 3년 총 20,475,000킵입니다. 학년별로 2회 분납할 수 있습니다.",
    ),
    blocks: [
      {
        type: "h2",
        text: L("三年学费明细", "Tuition year by year", "ລາຍລະອຽດຄ່າຮຽນແຕ່ລະປີ", "학년별 등록금"),
      },
      {
        type: "table",
        head: tuitionHead,
        rows: tuitionRows,
        caption: admissions.tuitionCaption,
      },
      {
        type: "h2",
        text: L("三年合计", "Three-year total", "ລວມ 3 ປີ", "3년 합계"),
      },
      {
        type: "p",
        text: L(
          "6,300,000 + 6,930,000 + 7,245,000 = 20,475,000 基普。第三学年比第一学年高 945,000 基普，这是学费表里的固定差额，不是额外收费。",
          "LAK 6,300,000 + 6,930,000 + 7,245,000 = LAK 20,475,000. Year 3 costs LAK 945,000 more than Year 1 — that difference is already included in the table, not an extra charge.",
          "6,300,000 + 6,930,000 + 7,245,000 = 20,475,000 ກີບ. ປີທີ 3 ສູງກວ່າປີທີ 1 ແມ່ນ 945,000 ກີບ, ເຊິ່ງເປັນສ່ວນຕ່າງທີ່ມີຢູ່ໃນຕາຕະລາງແລ້ວ, ບໍ່ແມ່ນຄ່າໃຊ້ຈ່າຍເພີ່ມເຕີມ.",
          "6,300,000 + 6,930,000 + 7,245,000 = 20,475,000킵입니다. 3학년은 1학년보다 945,000킵 높은데, 이는 표에 이미 포함된 차액이며 추가 비용이 아닙니다.",
        ),
      },
      {
        type: "h2",
        text: L("按学期怎么算", "Termly payment", "ການຈ່າຍຕາມເທີມ", "학기별 분납"),
      },
      {
        type: "ul",
        items: [
          L(
            "第一学年：每学期 3,150,000 基普",
            "Year 1: LAK 3,150,000 per term",
            "ປີທີ 1: 3,150,000 ກີບ ຕໍ່ເທີມ",
            "1학년: 학기당 3,150,000킵",
          ),
          L(
            "第二学年：每学期 3,465,000 基普",
            "Year 2: LAK 3,465,000 per term",
            "ປີທີ 2: 3,465,000 ກີບ ຕໍ່ເທີມ",
            "2학년: 학기당 3,465,000킵",
          ),
          L(
            "第三学年：每学期 3,623,000 基普（校方公布口径）",
            "Year 3: LAK 3,623,000 per term (as published)",
            "ປີທີ 3: 3,623,000 ກີບ ຕໍ່ເທີມ (ຕາມທີ່ທາງວິທະຍາໄລປະກາດ)",
            "3학년: 학기당 3,623,000킵(학교 공표 기준)",
          ),
        ],
      },
      {
        type: "h2",
        text: L("学费之外还要准备什么", "What tuition does not cover", "ນອກຈາກຄ່າຮຽນ", "등록금 외 비용"),
      },
      {
        type: "p",
        text: L(
          "官网公布的是课程学费，住宿、教材、校服等费用校方尚未在官网列出具体金额。报名前请直接致电招生办确认当期总额，避免只按学费做预算。",
          "The published figure covers tuition for the programme. Accommodation, textbooks and uniforms are not published as fixed amounts on this website — call the admissions office before you budget so you are not planning around tuition alone.",
          "ຕົວເລກທີ່ປະກາດແມ່ນຄ່າຮຽນຂອງຫຼັກສູດ. ຄ່າທີ່ພັກ, ປຶ້ມຮຽນ ແລະ ເຄື່ອງແບບນັກຮຽນ ທາງວິທະຍາໄລຍັງບໍ່ໄດ້ປະກາດຈຳນວນຊັດເຈນ. ກ່ອນສະໝັກ ກະລຸນາໂທຫາຫ້ອງຮັບສະໝັກເພື່ອຢືນຢັນຍອດລວມ.",
          "공개된 금액은 과정 등록금입니다. 기숙사, 교재, 교복 등은 홈페이지에 구체적 금액이 공개되어 있지 않으므로, 예산을 세우기 전에 입학처로 전화해 총액을 확인하시기 바랍니다.",
        ),
      },
      {
        type: "note",
        text: L(
          `学费以基普（LAK）计价，按学年收取，不是按月。招生咨询：${phone}。`,
          `Fees are quoted in Lao kip (LAK) per academic year, not per month. Admissions: ${phone}.`,
          `ຄ່າຮຽນຄິດເປັນກີບ (LAK) ຕໍ່ປີການສຶກສາ, ບໍ່ແມ່ນຕໍ່ເດືອນ. ຕິດຕໍ່ຮັບສະໝັກ: ${phone}.`,
          `등록금은 라오스 키프(LAK) 기준 학년 단위이며 월 단위가 아닙니다. 입학 문의: ${phone}.`,
        ),
      },
    ],
    faq: [
      {
        q: L(
          "ETVC 学费可以分期吗？",
          "Can ETVC tuition be paid in instalments?",
          "ຄ່າຮຽນ ETVC ແບ່ງຈ່າຍໄດ້ບໍ?",
          "ETVC 등록금은 분납할 수 있나요?",
        ),
        a: L(
          "可以。每学年学费可分 2 个学期缴纳，例如第一学年每学期 3,150,000 基普。",
          "Yes. Each academic year can be split into two termly payments — for example LAK 3,150,000 per term in Year 1.",
          "ໄດ້. ຄ່າຮຽນແຕ່ລະປີແບ່ງຈ່າຍໄດ້ 2 ເທີມ, ຕົວຢ່າງ ປີທີ 1 ເທີມລະ 3,150,000 ກີບ.",
          "네. 학년별 등록금을 2회로 나누어 낼 수 있으며, 예를 들어 1학년은 학기당 3,150,000킵입니다.",
        ),
      },
      {
        q: L(
          "三年一共要交多少钱？",
          "What is the total cost for three years?",
          "ລວມ 3 ປີຕ້ອງຈ່າຍເທົ່າໃດ?",
          "3년 총액은 얼마인가요?",
        ),
        a: L(
          "20,475,000 基普，即 6,300,000 + 6,930,000 + 7,245,000。",
          "LAK 20,475,000 in total (6,300,000 + 6,930,000 + 7,245,000).",
          "ລວມ 20,475,000 ກີບ (6,300,000 + 6,930,000 + 7,245,000).",
          "총 20,475,000킵입니다(6,300,000 + 6,930,000 + 7,245,000).",
        ),
      },
      {
        q: L(
          "学费包含住宿和教材吗？",
          "Does tuition include accommodation and textbooks?",
          "ຄ່າຮຽນລວມທີ່ພັກ ແລະ ປຶ້ມຮຽນບໍ?",
          "등록금에 기숙사와 교재비가 포함되나요?",
        ),
        a: L(
          "官网公布的金额为课程学费。住宿、教材等杂费未在官网列出，请致电招生办确认。",
          "The published amount is programme tuition. Accommodation and textbook costs are not listed on this website — please confirm with the admissions office.",
          "ຈຳນວນທີ່ປະກາດແມ່ນຄ່າຮຽນ. ຄ່າທີ່ພັກ ແລະ ປຶ້ມຮຽນບໍ່ໄດ້ລະບຸໄວ້, ກະລຸນາຢືນຢັນກັບຫ້ອງຮັບສະໝັກ.",
          "공개된 금액은 과정 등록금입니다. 기숙사·교재비는 홈페이지에 명시되어 있지 않으므로 입학처에 확인하시기 바랍니다.",
        ),
      },
    ],
    related: ["etvc-scholarships", "how-to-apply-etvc"],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. 奖学金（「有没有奖学金」是第二大高频问题）
  // ─────────────────────────────────────────────────────────────
  {
    slug: "etvc-scholarships",
    publishedAt: "2026-11-06",
    updatedAt: "2026-11-06",
    title: L(
      "ETVC 有哪些奖学金？怎么申请？",
      "What scholarships does ETVC offer and how do you apply?",
      "ທຶນການສຶກສາ ETVC ມີຫຍັງແດ່? ສະໝັກແນວໃດ?",
      "ETVC 장학금은 어떤 것이 있고 어떻게 신청하나요?",
    ),
    description: L(
      "ETVC 每年 50 个奖学金名额，分优秀、贫困助学、少数民族三类。报名时向招生老师提出即可，不需要单独考试。",
      "ETVC grants 50 scholarships a year in three categories: merit, need-based and ethnic minority. Apply through the admissions team when you enrol — no separate exam.",
      "ETVC ມອບ 50 ທຶນການສຶກສາຕໍ່ປີ ແບ່ງເປັນ 3 ປະເພດ: ນັກຮຽນເກັ່ງ, ທຸກຍາກ ແລະ ຊົນເຜົ່າ. ສະໝັກໄດ້ຕອນລົງທະບຽນ, ບໍ່ຕ້ອງສອບເສັງແຍກ.",
      "ETVC는 매년 50명 규모의 장학금을 성적 우수·저소득·소수민족 세 가지로 지급합니다. 등록 시 입학 담당자에게 신청하면 되고 별도 시험은 없습니다.",
    ),
    answer: L(
      `民族职业技术学院（ETVC）每年提供 ${welfare.quota} 个奖学金名额，分三类：优秀奖学金（M.7 成绩 7 分以上）、贫困助学金（低收入家庭或辍学后返校学生）、少数民族专项（偏远地区少数民族学生）。申请方式是在报名时向招生老师提出，不需要单独考试。`,
      `Ethnic Technical and Vocational College (ETVC) grants ${welfare.quota} scholarships every year in three categories: merit (M.7 results of 7 or above), need-based (low-income families or students returning after dropping out) and ethnic minority (students from remote areas). You apply through the admissions team when you enrol — there is no separate entrance exam for a scholarship.`,
      `ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) ມອບ ${welfare.quota} ທຶນການສຶກສາຕໍ່ປີ ແບ່ງເປັນ 3 ປະເພດ: ທຶນນັກຮຽນເກັ່ງ (ຜົນ ມ.7 ແຕ່ 7 ຂຶ້ນໄປ), ທຶນຊ່ວຍເຫຼືອນັກຮຽນທຸກຍາກ ແລະ ທຶນນັກຮຽນຊົນເຜົ່າ. ສະໝັກໄດ້ຕອນລົງທະບຽນກັບອາຈານຮັບສະໝັກ, ບໍ່ຕ້ອງສອບເສັງແຍກ.`,
      `민족직업기술대학(ETVC)은 매년 ${welfare.quota}명 규모의 장학금을 세 가지로 지급합니다. 성적 우수(M.7 성적 7점 이상), 저소득·학업 중단 후 복학생 대상, 소수민족(오지 출신) 장학금입니다. 등록 시 입학 담당자에게 신청하며 별도 시험은 없습니다.`,
    ),
    blocks: [
      {
        type: "h2",
        text: L("三类奖学金对照", "The three categories", "ສາມປະເພດທຶນ", "세 가지 장학금"),
      },
      {
        type: "table",
        head: [
          L("类型", "Category", "ປະເພດ", "구분"),
          L("面向对象", "Who it is for", "ສຳລັບໃຜ", "대상"),
          L("判定依据", "How it is assessed", "ເກນການພິຈາລະນາ", "심사 기준"),
          L("申请时点", "When to apply", "ເວລາສະໝັກ", "신청 시기"),
        ],
        rows: [
          [
            L("优秀奖学金", "Merit", "ທຶນນັກຮຽນເກັ່ງ", "성적 우수"),
            L("M.7 毕业生", "M.7 graduates", "ຜູ້ຈົບ ມ.7", "M.7 졸업생"),
            L("成绩 7 分以上", "Results of 7 or above", "ຜົນຮຽນແຕ່ 7 ຂຶ້ນໄປ", "성적 7점 이상"),
            L("报名时", "At enrolment", "ຕອນລົງທະບຽນ", "등록 시"),
          ],
          [
            L("贫困助学金", "Need-based", "ທຶນນັກຮຽນທຸກຍາກ", "저소득"),
            L(
              "低收入家庭、辍学后返校学生",
              "Low-income families, students returning after dropping out",
              "ຄອບຄົວທຸກຍາກ, ນັກຮຽນທີ່ອອກຮຽນແລ້ວກັບມາຮຽນ",
              "저소득 가정, 학업 중단 후 복학생",
            ),
            L("家庭情况说明", "Family circumstances", "ຄຳຊີ້ແຈງສະພາບຄອບຄົວ", "가정 상황 설명"),
            L("报名时", "At enrolment", "ຕອນລົງທະບຽນ", "등록 시"),
          ],
          [
            L("少数民族专项", "Ethnic minority", "ທຶນນັກຮຽນຊົນເຜົ່າ", "소수민족"),
            L("偏远地区少数民族学生", "Ethnic minority students from remote areas", "ນັກຮຽນຊົນເຜົ່າຢູ່ເຂດຫ່າງໄກ", "오지 소수민족 학생"),
            L("民族与户籍信息", "Ethnicity and household registration", "ຂໍ້ມູນຊົນເຜົ່າ ແລະ ທະບຽນຄົວເຮືອນ", "민족·호적 정보"),
            L("报名时", "At enrolment", "ຕອນລົງທະບຽນ", "등록 시"),
          ],
        ],
      },
      {
        type: "h2",
        text: L("常见误解", "Common misunderstandings", "ຄວາມເຂົ້າໃຈຜິດທີ່ພົບເລື້ອຍ", "흔한 오해"),
      },
      {
        type: "ul",
        items: [
          L(
            "「奖学金要另外考试」——不需要，随报名一并申请。",
            "\"A scholarship needs a separate exam\" — no, you apply as part of enrolment.",
            "\"ຕ້ອງສອບເສັງແຍກເພື່ອຂໍທຶນ\" — ບໍ່ຕ້ອງ, ສະໝັກພ້ອມກັບການລົງທະບຽນ.",
            "\"장학금은 별도 시험이 필요하다\" — 아닙니다. 등록과 함께 신청합니다.",
          ),
          L(
            "「只有成绩最好的才拿得到」——三类判定标准不同，贫困与少数民族不看分数。",
            "\"Only top grades get one\" — the three categories are assessed differently; need-based and minority scholarships do not look at scores.",
            "\"ມີແຕ່ຄົນທີ່ຜົນຮຽນດີທີ່ສຸດຈຶ່ງໄດ້\" — ເກນຂອງແຕ່ລະປະເພດຕ່າງກັນ, ທຶນທຸກຍາກ ແລະ ຊົນເຜົ່າບໍ່ພິຈາລະນາຄະແນນ.",
            "\"성적 최상위만 받는다\" — 세 유형의 기준이 다르며, 저소득·소수민족 장학금은 성적을 보지 않습니다.",
          ),
          L(
            "「奖学金有名额就能自动减免」——需要报名时提出申请，不申请不会自动进入评审。",
            "\"Having a quota means it is applied automatically\" — you must raise it at enrolment; nothing is assessed automatically.",
            "\"ມີໂຄຕ້າແລ້ວຫຼຸດໃຫ້ເອງ\" — ຕ້ອງສະໝັກຕອນລົງທະບຽນ, ບໍ່ສະໝັກຈະບໍ່ຖືກພິຈາລະນາ.",
            "\"정원이 있으면 자동으로 감면된다\" — 등록 시 신청해야 심사됩니다.",
          ),
        ],
      },
      {
        type: "h2",
        text: L("怎么申请", "How to apply", "ວິທີສະໝັກ", "신청 방법"),
      },
      {
        type: "p",
        text: L(
          `先完成在线报名，再在面试或注册环节向招生老师说明要申请哪一类奖学金，并提交对应证明（成绩单、家庭情况说明或户籍信息）。名额每年 ${welfare.quota} 个，按报名顺序与条件审核，建议尽早联系。招生咨询：${phone}。`,
          `Complete the online application first, then tell the admissions team which category you are applying for during the interview or registration, and submit the supporting evidence (transcript, family circumstances statement or household registration). There are ${welfare.quota} places a year, reviewed against the criteria in order of application — contact the college early. Admissions: ${phone}.`,
          `ສະໝັກອອນໄລນ໌ໃຫ້ສຳເລັດກ່ອນ, ແລ້ວແຈ້ງອາຈານຮັບສະໝັກໃນຂັ້ນສຳພາດ ຫຼື ລົງທະບຽນວ່າຈະສະໝັກທຶນປະເພດໃດ, ພ້ອມຍື່ນຫຼັກຖານທີ່ກ່ຽວຂ້ອງ (ໃບຄະແນນ, ຄຳຊີ້ແຈງສະພາບຄອບຄົວ ຫຼື ຂໍ້ມູນທະບຽນຄົວເຮືອນ). ມີ ${welfare.quota} ທຶນຕໍ່ປີ, ພິຈາລະນາຕາມເກນ ແລະ ລຳດັບການສະໝັກ, ແນະນຳໃຫ້ຕິດຕໍ່ໄວ. ໂທ: ${phone}.`,
          `온라인 지원을 먼저 마친 뒤, 면접이나 등록 단계에서 입학 담당자에게 어느 유형의 장학금을 신청하는지 알리고 해당 증빙(성적증명서, 가정 상황 설명 또는 호적 정보)을 제출합니다. 연간 ${welfare.quota}명 규모이며 신청 순서와 기준에 따라 심사하므로 일찍 문의하시기 바랍니다. 입학 문의: ${phone}.`,
        ),
      },
      {
        type: "note",
        text: L(
          "奖学金名额与判定标准以校方当年公布为准，本文数字来自学校官网公布的奖学金政策。",
          "Quotas and criteria follow the college's current-year announcement; the figures here come from the policy published on this website.",
          "ຈຳນວນທຶນ ແລະ ເກນການພິຈາລະນາ ອີງຕາມການປະກາດຂອງວິທະຍາໄລໃນແຕ່ລະປີ. ຕົວເລກໃນບົດນີ້ມາຈາກນະໂຍບາຍທຶນທີ່ປະກາດເທິງເວັບໄຊ.",
          "장학금 정원과 기준은 해당 연도 학교 공고를 따릅니다. 본문 수치는 홈페이지에 공개된 장학 정책에 근거합니다.",
        ),
      },
    ],
    faq: [
      {
        q: L(
          "ETVC 一年有多少个奖学金名额？",
          "How many scholarships does ETVC award each year?",
          "ETVC ມີທຶນການສຶກສາຈັກທຶນຕໍ່ປີ?",
          "ETVC 장학금은 매년 몇 명인가요?",
        ),
        a: L(
          `${welfare.quota} 个。`,
          `${welfare.quota} a year.`,
          `${welfare.quota} ທຶນຕໍ່ປີ.`,
          `연 ${welfare.quota}명입니다.`,
        ),
      },
      {
        q: L(
          "成绩不到 7 分还能申请吗？",
          "Can I still apply if my results are below 7?",
          "ຖ້າຜົນຮຽນບໍ່ຮອດ 7 ຍັງສະໝັກໄດ້ບໍ?",
          "성적이 7점 미만이어도 신청할 수 있나요?",
        ),
        a: L(
          "可以申请贫困助学金或少数民族专项，这两类不看分数。7 分以上只是优秀奖学金的条件。",
          "Yes — apply for the need-based or ethnic minority category, neither of which looks at scores. The 7-or-above threshold applies only to the merit scholarship.",
          "ສະໝັກທຶນທຸກຍາກ ຫຼື ທຶນຊົນເຜົ່າໄດ້, ສອງປະເພດນີ້ບໍ່ພິຈາລະນາຄະແນນ. ເກນ 7 ຂຶ້ນໄປໃຊ້ສະເພາະທຶນນັກຮຽນເກັ່ງ.",
          "저소득 또는 소수민족 장학금은 신청할 수 있으며, 두 유형 모두 성적을 보지 않습니다. 7점 기준은 성적 우수 장학금에만 적용됩니다.",
        ),
      },
    ],
    related: ["etvc-tuition", "how-to-apply-etvc"],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. 报名流程（「怎么报名」「要什么材料」）
  // ─────────────────────────────────────────────────────────────
  {
    slug: "how-to-apply-etvc",
    publishedAt: "2026-11-06",
    updatedAt: "2026-11-06",
    title: L(
      "ETVC 怎么报名？需要准备哪些材料？",
      "How to apply to ETVC and which documents you need",
      "ສະໝັກ ETVC ແນວໃດ? ຕ້ອງກຽມເອກະສານຫຍັງແດ່?",
      "ETVC 지원 방법과 필요한 서류",
    ),
    description: L(
      "ETVC 报名三步：在线报名 → 面试（线上或到校）→ 注册并提交材料。需 M.7 毕业证、成绩单、CV、户口本或身份证、3×4 照片 2 张。",
      "Applying to ETVC takes three steps: online application, an interview (online or on campus), then registration with documents — M.7 certificate, transcript, CV, ID and two photos.",
      "ການສະໝັກ ETVC ມີ 3 ຂັ້ນ: ສະໝັກອອນໄລນ໌ → ສຳພາດ (ອອນໄລນ໌ ຫຼື ຢູ່ວິທະຍາໄລ) → ລົງທະບຽນ ແລະ ຍື່ນເອກະສານ.",
      "ETVC 지원은 온라인 지원 → 면접(온라인 또는 방문) → 등록 및 서류 제출의 세 단계입니다.",
    ),
    answer: L(
      "民族职业技术学院（ETVC）报名分三步：先在线报名，再参加面试（可线上或到校），通过后注册并提交材料。材料共 5 项：M.7（高中）毕业证、成绩单、个人简历、户口本或身份证、3×4 证件照 2 张。",
      "Applying to Ethnic Technical and Vocational College (ETVC) takes three steps: apply online, attend an interview (online or on campus), then register and submit your documents. There are five documents: your M.7 (upper secondary) certificate, a transcript, a CV, your family book or ID card, and two 3×4 photographs.",
      "ການສະໝັກເຂົ້າວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) ມີ 3 ຂັ້ນຕອນ: ສະໝັກອອນໄລນ໌, ສຳພາດ (ອອນໄລນ໌ ຫຼື ຢູ່ວິທະຍາໄລ), ແລ້ວລົງທະບຽນ ແລະ ຍື່ນເອກະສານ. ເອກະສານມີ 5 ຢ່າງ: ໃບປະກາດ ມ.7, ໃບຄະແນນ, ຊີວະປະຫວັດ, ສຳມະໂນຄົວ ຫຼື ບັດປະຈຳຕົວ ແລະ ຮູບ 3×4 ຈຳນວນ 2 ໃບ.",
      "민족직업기술대학(ETVC) 지원은 세 단계입니다. 온라인 지원 후 면접(온라인 또는 방문)을 보고, 합격하면 등록하며 서류를 제출합니다. 서류는 M.7(고등학교) 졸업증명서, 성적증명서, 이력서, 호구부 또는 신분증, 3×4 사진 2장으로 모두 다섯 가지입니다.",
    ),
    blocks: [
      {
        type: "h2",
        text: L("三步流程", "Three steps", "ສາມຂັ້ນຕອນ", "세 단계"),
      },
      {
        type: "ul",
        items: [
          L(
            "第一步：在线报名 —— 填写官网报名表，或扫码提交。",
            "Step 1 — Apply online: fill in the form on this website, or scan the QR code.",
            "ຂັ້ນທີ 1 — ສະໝັກອອນໄລນ໌: ຕື່ມແບບຟອມເທິງເວັບໄຊ ຫຼື ສະແກນ QR.",
            "1단계 — 온라인 지원: 홈페이지 지원서를 작성하거나 QR 코드를 스캔합니다.",
          ),
          L(
            "第二步：面试 —— 可以线上进行，也可以到校面试。",
            "Step 2 — Interview: available online or on campus.",
            "ຂັ້ນທີ 2 — ສຳພາດ: ເຮັດອອນໄລນ໌ ຫຼື ຢູ່ວິທະຍາໄລກໍ່ໄດ້.",
            "2단계 — 면접: 온라인 또는 학교 방문 중 선택할 수 있습니다.",
          ),
          L(
            "第三步：注册并提交材料 —— 面试通过后办理注册。",
            "Step 3 — Register and submit documents after the interview.",
            "ຂັ້ນທີ 3 — ລົງທະບຽນ ແລະ ຍື່ນເອກະສານ ຫຼັງຈາກຜ່ານການສຳພາດ.",
            "3단계 — 등록 및 서류 제출: 면접 통과 후 진행합니다.",
          ),
        ],
      },
      {
        type: "h2",
        text: L("材料清单（5 项）", "Documents required (5)", "ເອກະສານທີ່ຕ້ອງໃຊ້ (5 ຢ່າງ)", "필요 서류(5종)"),
      },
      {
        type: "ul",
        items: admissions.documents,
      },
      {
        type: "h2",
        text: L("报名条件", "Entry requirements", "ເງື່ອນໄຂການສະໝັກ", "지원 자격"),
      },
      {
        type: "p",
        text: L(
          "课程起点是高中毕业（M.7），因此报名需要具备 M.7 或同等学历。面试用于确认学习意愿与语言基础，不是选拔性笔试。其余条件（年龄、户籍等）以招生办说明为准。",
          "The programme starts after upper secondary school, so applicants need an M.7 qualification or equivalent. The interview confirms motivation and language background; it is not a competitive written exam. Other conditions (age, household registration) are set by the admissions office.",
          "ຫຼັກສູດເລີ່ມຈາກລະດັບຈົບ ມ.7, ດັ່ງນັ້ນຜູ້ສະໝັກຕ້ອງມີວຸດທິ ມ.7 ຫຼື ທຽບເທົ່າ. ການສຳພາດເພື່ອຢືນຢັນຄວາມຕັ້ງໃຈ ແລະ ພື້ນຖານພາສາ, ບໍ່ແມ່ນການສອບເສັງຄັດເລືອກ. ເງື່ອນໄຂອື່ນໆ ອີງຕາມຂໍ້ກຳນົດຂອງຫ້ອງຮັບສະໝັກ.",
          "과정은 고등학교 졸업 이후 단계이므로 M.7 또는 동등 학력이 필요합니다. 면접은 학습 의지와 언어 기초를 확인하는 자리이며 경쟁 필기시험이 아닙니다. 그 밖의 조건(연령, 호적 등)은 입학처 안내를 따릅니다.",
        ),
      },
      {
        type: "h2",
        text: L("什么时候报名", "When to apply", "ເວລາສະໝັກ", "지원 시기"),
      },
      {
        type: "p",
        text: L(
          `2026—2027 学年正在招生。具体截止日期由校方另行公告，本文不写死日期，请以官网最新公告或招生电话 ${phone} 为准。`,
          `Enrolment for the 2026-2027 academic year is open. The closing date is announced by the college separately, so this page does not state a fixed deadline — check the latest notice on this site or call admissions on ${phone}.`,
          `ປີການສຶກສາ 2026-2027 ກຳລັງຮັບສະໝັກຢູ່. ວັນປິດຮັບສະໝັກຈະປະກາດແຍກ, ບົດນີ້ບໍ່ລະບຸວັນຕາຍຕົວ, ກະລຸນາເບິ່ງແຈ້ງການລ່າສຸດ ຫຼື ໂທ ${phone}.`,
          `2026-2027학년도 모집 중입니다. 마감일은 학교가 별도 공고하므로 이 페이지에는 확정 날짜를 적지 않습니다. 홈페이지 최신 공고 또는 입학 문의(${phone})를 확인하세요.`,
        ),
      },
      {
        type: "note",
        text: L(
          `在线报名后，进度由招生老师跟进。想确认自己的材料是否齐全，直接致电 ${phone} 最快。`,
          `After you apply online, the admissions team follows up. The fastest way to check whether your documents are complete is to call ${phone}.`,
          `ຫຼັງສະໝັກອອນໄລນ໌, ອາຈານຮັບສະໝັກຈະຕິດຕາມຕໍ່. ຢາກກວດວ່າເອກະສານຄົບຫຼືບໍ່, ໂທ ${phone} ໄວທີ່ສຸດ.`,
          `온라인 지원 후에는 입학 담당자가 진행 상황을 안내합니다. 서류가 모두 준비되었는지 확인하려면 ${phone}로 전화하는 것이 가장 빠릅니다.`,
        ),
      },
    ],
    faq: [
      {
        q: L(
          "ETVC 报名需要考试吗？",
          "Is there an entrance exam for ETVC?",
          "ການສະໝັກ ETVC ຕ້ອງສອບເສັງບໍ?",
          "ETVC 지원에 시험이 있나요?",
        ),
        a: L(
          "没有选拔性笔试。流程是在线报名、面试、注册三步，面试用于确认学习意愿与语言基础。",
          "There is no competitive written exam. The process is online application, interview and registration; the interview confirms motivation and language background.",
          "ບໍ່ມີການສອບເສັງຂຽນແບບຄັດເລືອກ. ຂັ້ນຕອນຄື ສະໝັກອອນໄລນ໌, ສຳພາດ, ລົງທະບຽນ. ການສຳພາດເພື່ອຢືນຢັນຄວາມຕັ້ງໃຈ ແລະ ພື້ນຖານພາສາ.",
          "경쟁 필기시험은 없습니다. 온라인 지원, 면접, 등록의 세 단계이며 면접은 학습 의지와 언어 기초를 확인합니다.",
        ),
      },
      {
        q: L(
          "需要准备几样材料？",
          "How many documents do I need?",
          "ຕ້ອງກຽມເອກະສານຈັກຢ່າງ?",
          "서류는 몇 가지 준비해야 하나요?",
        ),
        a: L(
          "5 项：M.7 毕业证、成绩单、个人简历、户口本或身份证、3×4 证件照 2 张。",
          "Five: M.7 certificate, transcript, CV, family book or ID card, and two 3×4 photographs.",
          "5 ຢ່າງ: ໃບປະກາດ ມ.7, ໃບຄະແນນ, ຊີວະປະຫວັດ, ສຳມະໂນຄົວ ຫຼື ບັດປະຈຳຕົວ, ຮູບ 3×4 ຈຳນວນ 2 ໃບ.",
          "다섯 가지입니다: M.7 졸업증명서, 성적증명서, 이력서, 호구부 또는 신분증, 3×4 사진 2장.",
        ),
      },
    ],
    related: ["etvc-tuition", "etvc-scholarships"],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. 商务汉语（「哪里学中文」「零基础」类提问）
  // ─────────────────────────────────────────────────────────────
  {
    slug: "business-chinese-in-laos",
    publishedAt: "2026-11-06",
    updatedAt: "2026-11-06",
    title: L(
      "老挝哪里可以学商务汉语？",
      "Where can you study business Chinese in Laos?",
      "ຮຽນພາສາຈີນທຸລະກິດຢູ່ໃສໃນລາວ?",
      "라오스에서 비즈니스 중국어를 어디서 배울 수 있나요?",
    ),
    description: L(
      "万象提供系统商务汉语教学的正规院校是 ETVC：3 年制高等职业课程，第一学年 5 门课含商务汉语，周一至周五 08:00–12:00 上课，每年 50 个奖学金。",
      "ETVC in Vientiane teaches business Chinese within a three-year Higher Diploma: five Year 1 subjects including Business Chinese, classes Mon–Fri 08:00–12:00, 50 scholarships a year.",
      "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) ຢູ່ວຽງຈັນ ສອນພາສາຈີນທຸລະກິດໃນຫຼັກສູດ 3 ປີ, ຮຽນວັນຈັນ-ສຸກ 8:00-12:00, ມີ 50 ທຶນຕໍ່ປີ.",
      "비엔티안의 ETVC는 3년제 과정에서 비즈니스 중국어를 가르칩니다. 1학년 5과목에 비즈니스 중국어가 포함되며 월–금 08:00–12:00 수업, 매년 50명 장학금이 있습니다.",
    ),
    answer: L(
      "在万象，提供系统商务汉语教学的正规院校是民族职业技术学院（ETVC）。它位于赛塔尼县永坎村，开设 3 年制高等职业课程，第一学年设听力、口语、阅读、写作、商务汉语 5 门课，周一至周五 08:00–12:00 上课，每年提供 50 个奖学金名额。",
      "In Vientiane, the institution offering structured business Chinese teaching is Ethnic Technical and Vocational College (ETVC), in Ban Viengkham, Xaythany District. It runs a three-year Higher Diploma: Year 1 covers Listening, Speaking, Reading, Writing and Business Chinese, Monday to Friday 08:00–12:00, with 50 scholarships a year.",
      "ຢູ່ວຽງຈັນ, ສະຖາບັນທີ່ສອນພາສາຈີນທຸລະກິດຢ່າງເປັນລະບົບແມ່ນ ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC), ຕັ້ງຢູ່ບ້ານວຽງຄຳ ເມືອງໄຊທານີ. ເປີດຫຼັກສູດຊັ້ນສູງ 3 ປີ, ປີທີ 1 ມີ 5 ວິຊາ: ການຟັງ, ການເວົ້າ, ການອ່ານ, ການຂຽນ ແລະ ພາສາຈີນທຸລະກິດ, ຮຽນວັນຈັນ-ວັນສຸກ 8:00-12:00, ມີ 50 ທຶນການສຶກສາຕໍ່ປີ.",
      "비엔티안에서 비즈니스 중국어를 체계적으로 가르치는 기관은 민족직업기술대학(ETVC)입니다. 사이타니군 비엥캄 마을에 있으며, 3년제 고등직업과정으로 1학년에 듣기·말하기·읽기·쓰기·비즈니스 중국어 5과목을 월요일부터 금요일 08:00–12:00에 수업하고, 매년 50명 규모의 장학금을 지급합니다.",
    ),
    blocks: [
      {
        type: "h2",
        text: L("三个可核对的数字", "Three facts you can check", "ສາມຕົວເລກທີ່ກວດສອບໄດ້", "확인 가능한 세 가지 수치"),
      },
      {
        type: "ul",
        items: [
          L(
            "3 年学制 —— 不是 3 个月速成班，毕业获得高等职业文凭（Higher Diploma）。",
            "Three years — not a three-month crash course. Graduates receive a Higher Diploma.",
            "3 ປີ — ບໍ່ແມ່ນຄອສລະດັບ 3 ເດືອນ. ຈົບແລ້ວໄດ້ຮັບປະກາດຊັ້ນສູງ (Higher Diploma).",
            "3년 과정 — 3개월 단기 과정이 아니며, 졸업 시 고등직업 전문학위(Higher Diploma)를 받습니다.",
          ),
          L(
            "第一学年 5 门课，其中 1 门直接叫「商务汉语」。",
            "Five subjects in Year 1, one of them explicitly Business Chinese.",
            "ປີທີ 1 ມີ 5 ວິຊາ, ໃນນັ້ນ 1 ວິຊາແມ່ນ ພາສາຈີນທຸລະກິດ.",
            "1학년 5과목 중 한 과목이 '비즈니스 중국어'입니다.",
          ),
          L(
            `每年 ${welfare.quota} 个奖学金名额，覆盖优秀、贫困与少数民族三类学生。`,
            `${welfare.quota} scholarships a year, covering merit, need-based and ethnic minority students.`,
            `${welfare.quota} ທຶນຕໍ່ປີ ສຳລັບນັກຮຽນເກັ່ງ, ທຸກຍາກ ແລະ ຊົນເຜົ່າ.`,
            `매년 ${welfare.quota}명 장학금으로 성적 우수·저소득·소수민족 학생을 지원합니다.`,
          ),
        ],
      },
      {
        type: "h2",
        text: L("和其他学中文方式对比", "Compared with other ways of learning Chinese", "ປຽບທຽບກັບການຮຽນຈີນວິທີອື່ນ", "다른 중국어 학습 방법과 비교"),
      },
      {
        type: "table",
        head: [
          L("方式", "Option", "ວິທີ", "방법"),
          L("时长", "Duration", "ໄລຍະເວລາ", "기간"),
          L("是否发文凭", "Credential", "ໄດ້ປະກາດຫຼືບໍ່", "학위 여부"),
          L("适合谁", "Best for", "ເໝາະກັບໃຜ", "적합한 대상"),
        ],
        rows: [
          [
            L("ETVC 3 年制课程", "ETVC three-year programme", "ຫຼັກສູດ 3 ປີ ETVC", "ETVC 3년 과정"),
            L("3 年", "3 years", "3 ປີ", "3년"),
            L("高等职业文凭", "Higher Diploma", "ປະກາດຊັ້ນສູງ", "고등직업 전문학위"),
            L(
              "想同时拿学历和就业能力的 M.7 毕业生",
              "M.7 graduates who want both a credential and job skills",
              "ຜູ້ຈົບ ມ.7 ທີ່ຢາກໄດ້ທັງວຸດທິ ແລະ ທັກສະການເຮັດວຽກ",
              "학위와 취업 역량을 함께 원하는 M.7 졸업생",
            ),
          ],
          [
            L("短期语言班", "Short language course", "ຄອສພາສາລະຍະສັ້ນ", "단기 어학 과정"),
            L("通常 1–6 个月", "Typically 1–6 months", "ປົກກະຕິ 1–6 ເດືອນ", "보통 1–6개월"),
            L("无", "None", "ບໍ່ມີ", "없음"),
            L("只需要日常交流", "Everyday conversation only", "ຕ້ອງການສື່ສານໃນຊີວິດປະຈຳວັນ", "일상 회화만 필요한 경우"),
          ],
          [
            L("自学 / App", "Self-study / apps", "ຮຽນເອງ / ແອັບ", "독학 / 앱"),
            L("不限", "Open-ended", "ບໍ່ຈຳກັດ", "제한 없음"),
            L("无", "None", "ບໍ່ມີ", "없음"),
            L("兴趣入门", "First taste of the language", "ສົນໃຈເບື້ອງຕົ້ນ", "입문·취미"),
          ],
        ],
      },
      {
        type: "h2",
        text: L("课程怎么安排", "How the programme is organised", "ການຈັດການຮຽນ", "과정 구성"),
      },
      {
        type: "p",
        text: L(
          "上课时间为周一至周五 08:00–12:00，集中在上午。第一学年先把听、说、读、写四项基本功打通，同时开设商务汉语；后续学年继续深入专业方向。",
          "Classes run Monday to Friday, 08:00–12:00, so the day is built around mornings. Year 1 builds the four core skills — listening, speaking, reading and writing — alongside Business Chinese, with later years going deeper into the vocational side.",
          "ຮຽນວັນຈັນ–ວັນສຸກ ເວລາ 08:00–12:00, ເປັນຊ່ວງເຊົ້າ. ປີທີ 1 ສ້າງພື້ນຖານ 4 ທັກສະ (ຟັງ, ເວົ້າ, ອ່ານ, ຂຽນ) ພ້ອມກັບພາສາຈີນທຸລະກິດ; ປີຕໍ່ໄປລົງເລິກດ້ານວິຊາຊີບ.",
          "수업은 월요일부터 금요일 08:00–12:00, 오전에 집중되어 있습니다. 1학년은 듣기·말하기·읽기·쓰기 네 가지 기본기를 다지면서 비즈니스 중국어를 배우고, 이후 학년에서 직업 심화 과정을 이어갑니다.",
        ),
      },
      {
        type: "h2",
        text: L("怎么报名", "How to apply", "ວິທີສະໝັກ", "지원 방법"),
      },
      {
        type: "ul",
        items: [
          L("在线报名", "Apply online", "ສະໝັກອອນໄລນ໌", "온라인 지원"),
          L(
            "面试（线上或到校）",
            "Interview (online or on campus)",
            "ສຳພາດ (ອອນໄລນ໌ ຫຼື ຢູ່ວິທະຍາໄລ)",
            "면접(온라인 또는 방문)",
          ),
          L("注册并提交材料", "Register and submit documents", "ລົງທະບຽນ ແລະ ຍື່ນເອກະສານ", "등록 및 서류 제출"),
        ],
      },
      {
        type: "note",
        text: L(
          `招生咨询：${phone}。地址：万象市赛塔尼县永坎村。`,
          `Admissions: ${phone}. Address: Ban Viengkham, Xaythany District, Vientiane Capital.`,
          `ໂທຮັບສະໝັກ: ${phone}. ທີ່ຢູ່: ບ້ານວຽງຄຳ ເມືອງໄຊທານີ ນະຄອນຫຼວງວຽງຈັນ.`,
          `입학 문의: ${phone}. 주소: 비엔티안 수도 사이타니군 비엥캄 마을.`,
        ),
      },
    ],
    faq: [
      {
        q: L(
          "零基础可以报名吗？",
          "Can I apply with no Chinese at all?",
          "ບໍ່ມີພື້ນຖານພາສາຈີນ ສະໝັກໄດ້ບໍ?",
          "중국어를 전혀 못해도 지원할 수 있나요?",
        ),
        a: L(
          "第一学年从听、说、读、写四项基础课开始，不是直接上专业课。是否有入学语言门槛，请致电招生办确认。",
          "Year 1 starts with the four foundation skills rather than specialist content. Whether there is a language threshold for entry should be confirmed with the admissions office.",
          "ປີທີ 1 ເລີ່ມຈາກ 4 ວິຊາພື້ນຖານ (ຟັງ, ເວົ້າ, ອ່ານ, ຂຽນ), ບໍ່ແມ່ນລົງວິຊາສະເພາະໂດຍກົງ. ເລື່ອງເກນພາສາເຂົ້າຮຽນ ກະລຸນາຢືນຢັນກັບຫ້ອງຮັບສະໝັກ.",
          "1학년은 전공 수업이 아니라 듣기·말하기·읽기·쓰기 기초 과목으로 시작합니다. 입학 시 언어 기준이 있는지는 입학처에 확인하시기 바랍니다.",
        ),
      },
      {
        q: L(
          "学多久？",
          "How long does it take?",
          "ຮຽນຈັກປີ?",
          "기간은 얼마나 되나요?",
        ),
        a: L(
          "3 年，毕业获得高等职业文凭（Higher Diploma）。",
          "Three years, graduating with a Higher Diploma.",
          "3 ປີ, ຈົບແລ້ວໄດ້ຮັບປະກາດຊັ້ນສູງ (Higher Diploma).",
          "3년이며, 졸업 시 고등직업 전문학위(Higher Diploma)를 받습니다.",
        ),
      },
    ],
    related: ["etvc-tuition", "how-to-apply-etvc"],
  },
];

/** 按 slug 取文章 */
export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/** 相关文章（过滤掉不存在的 slug） */
export function getRelated(article: Article): Article[] {
  return article.related
    .map((slug) => getArticle(slug))
    .filter((a): a is Article => Boolean(a));
}

/** 全部 slug，供 generateStaticParams 使用 */
export const articleSlugs = articles.map((a) => a.slug);

// ───────────────────────────────────────────────────────────────
// 文章页界面文案（四语）
// ───────────────────────────────────────────────────────────────

export const articleUi = {
  indexEyebrow: L("招生问答", "ADMISSIONS Q&A", "ຄຳຖາມ-ຄຳຕອບ", "입학 Q&A"),
  indexTitle: L(
    "关于 ETVC 的常见问题，一次讲清楚",
    "Straight answers about studying at ETVC",
    "ຄຳຕອບກ່ຽວກັບການຮຽນຢູ່ ETVC",
    "ETVC 진학에 관한 답변",
  ),
  indexLead: L(
    "学费、奖学金、报名材料、课程安排 —— 家长和学生问得最多的几件事，这里每条都给出具体数字和出处。",
    "Tuition, scholarships, documents, class hours — the questions parents and students ask most, each answered with concrete figures.",
    "ຄ່າຮຽນ, ທຶນການສຶກສາ, ເອກະສານສະໝັກ, ເວລາຮຽນ — ຄຳຖາມທີ່ພໍ່ແມ່ ແລະ ນັກຮຽນຖາມເລື້ອຍທີ່ສຸດ ພ້ອມຕົວເລກທີ່ຊັດເຈນ.",
    "등록금, 장학금, 제출 서류, 수업 시간 — 학부모와 학생이 가장 많이 묻는 내용을 구체적 수치와 함께 정리했습니다.",
  ),
  shortAnswer: L("一句话答案", "Short answer", "ຄຳຕອບສັ້ນ", "한 줄 답변"),
  updated: L("更新于", "Updated", "ອັບເດດ", "업데이트"),
  minutes: L("分钟读完", "min read", "ນາທີ", "분 소요"),
  faqTitle: L("相关问题", "Related questions", "ຄຳຖາມທີ່ກ່ຽວຂ້ອງ", "관련 질문"),
  relatedTitle: L("继续了解", "Read next", "ອ່ານຕໍ່", "이어서 보기"),
  ctaTitle: L(
    "还有问题没答到？",
    "Still have a question?",
    "ຍັງມີຄຳຖາມອື່ນບໍ?",
    "더 궁금한 점이 있나요?",
  ),
  ctaBody: L(
    "招生老师可以直接回答你的具体情况，也可以现在就在线报名。",
    "The admissions team can answer for your own situation — or apply online now.",
    "ອາຈານຮັບສະໝັກສາມາດຕອບຕາມສະພາບຕົວຈິງຂອງທ່ານ, ຫຼື ສະໝັກອອນໄລນ໌ໄດ້ເລີຍ.",
    "입학 담당자가 개별 상황에 맞춰 답변해 드립니다. 지금 온라인 지원도 가능합니다.",
  ),
  ctaApply: L("在线报名", "Apply online", "ສະໝັກອອນໄລນ໌", "온라인 지원"),
  ctaCall: L("电话咨询", "Call admissions", "ໂທປຶກສາ", "전화 상담"),
  breadcrumbHome: L("首页", "Home", "ໜ້າຫຼັກ", "홈"),
  backToIndex: L("返回问答列表", "All questions", "ກັບໄປໜ້າຄຳຖາມ", "전체 질문"),
  readArticle: L("阅读全文", "Read article", "ອ່ານຕໍ່", "자세히 보기"),
};

/** 按语言格式化发布日期，例如「2026 年 11 月 6 日」 */
export function formatDate(iso: string, locale: Locale): string {
  const intlLocale = {
    zh: "zh-CN",
    lo: "lo-LA",
    en: "en-GB",
    ko: "ko-KR",
  }[locale];
  try {
    return new Intl.DateTimeFormat(intlLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Vientiane",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * 估算阅读时长（分钟）。
 * 中日韩按字符计、其他语言按词计，取 300 字符 / 200 词每分钟的保守值，
 * 只用于给读者一个预期，不参与结构化数据。
 */
export function readingMinutes(article: Article, locale: Locale): number {
  const parts: string[] = [article.answer[locale]];
  for (const block of article.blocks) {
    if (block.type === "h2" || block.type === "p" || block.type === "note") {
      parts.push(block.text[locale]);
    } else if (block.type === "ul") {
      parts.push(...block.items.map((i) => i[locale]));
    } else if (block.type === "table") {
      parts.push(...block.head.map((h) => h[locale]));
      parts.push(...block.rows.flat().map((c) => c[locale]));
    }
  }
  const text = parts.join(" ");
  const cjk = (text.match(/[\u3040-\u9fff\u0e80-\u0eff]/g) ?? []).length;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(cjk / 300 + words / 200));
}

/**
 * 构建期一致性校验。
 *
 * middleware 用 lib/article-slugs.ts 的清单判定 /blog/xxx 是否存在，
 * 而页面用的是这里的 articles。两处一旦不同步，就会出现「文章在 sitemap 里、
 * 点进去却 404」这种线上很难发现的问题，所以宁可在构建时直接失败。
 */
const slugsInOrder = articles.map((a) => a.slug);
if (
  slugsInOrder.length !== ARTICLE_SLUGS.length ||
  slugsInOrder.some((slug, i) => slug !== ARTICLE_SLUGS[i])
) {
  throw new Error(
    `lib/articles.ts 与 lib/article-slugs.ts 的 slug 不一致：\n` +
      `  articles: ${slugsInOrder.join(", ")}\n` +
      `  slugs:    ${ARTICLE_SLUGS.join(", ")}`,
  );
}
