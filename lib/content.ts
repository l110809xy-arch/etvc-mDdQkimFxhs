/**
 * 老挝民族职业技术学院（ETVC）站点文案与数据
 * 内容严格依据校方文档《Website Content Specification》编写：
 * 老挝语为文档原文，中文 / 英文 / 韩文为对应译文。
 */

import { L, type Localized } from "./i18n";

export type NavItem = { label: Localized; href: string };

export const school = {
  name: L(
    "民族职业技术学院",
    "Ethnic Technical and Vocational College",
    "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
    "민족직업기술대학",
  ),
  nameSub: L(
    "ETHNIC TECHNICAL & VOCATIONAL COLLEGE",
    "VIENTIANE · LAO PDR",
    "ວຽງຈັນ · ສປປ ລາວ",
    "ETHNIC TECHNICAL & VOCATIONAL COLLEGE",
  ),
  abbr: "ETVC",
  /** 文档 Slogan 原文 */
  slogan: L(
    "学好双语 发展职业 走向国际",
    "Learn Two Languages · Build a Career · Go Global",
    "ຮຽນຮູ້ສອງພາສາ ພັດທະນາວິຊາຊີບ ກ້າວໄກສູ່ສາກົນ",
    "두 언어를 배우고 · 직업을 키우고 · 세계로 나아가다",
  ),
  founded: "2020",
  partner: L(
    "老挝建国阵线",
    "Lao Front for National Development",
    "ແນວລາວສ້າງຊາດ",
    "라오스건국전선",
  ),
  website: "www.etvc.la",
};

/** 文档 1. Header Menu：六项，顺序与名称照文档 */
export const navItems: NavItem[] = [
  { label: L("首页", "Home", "ໜ້າຫຼັກ", "홈"), href: "#top" },
  {
    label: L("关于我们", "About Us", "ກ່ຽວກັບວິທະຍາໄລ", "대학 소개"),
    href: "#about",
  },
  {
    label: L("课程设置", "Academics", "ຫຼັກສູດການຮຽນ-ການສອນ", "교육과정"),
    href: "#academics",
  },
  {
    label: L(
      "招生与学费",
      "Admissions",
      "ການຮັບສະໝັກ & ຄ່າທຳນຽມ",
      "입학·등록금",
    ),
    href: "#admission",
  },
  {
    label: L(
      "学生生活与图库",
      "Student Life & Gallery",
      "ກິດຈະກຳ & ຮູບພາບ",
      "학생 생활 & 갤러리",
    ),
    href: "#campus",
  },
  {
    label: L("联系我们", "Contact Us", "ຕິດຕໍ່ເຮົາ", "연락처"),
    href: "#contact",
  },
];

export const ui = {
  /** 文档 Header CTA Button：[ສະໝັກຮຽນອອນໄລນ໌] */
  applyOnline: L("在线报名", "Apply Online", "ສະໝັກຮຽນອອນໄລນ໌", "온라인 지원"),
  viewCourses: L("查看课程", "View Courses", "ເບິ່ງຫຼັກສູດ", "교육과정 보기"),
  notice: L("公告", "Notice", "ແຈ້ງການ", "공지"),
  phoneConsult: L("电话咨询", "Call us", "ໂທປຶກສາ", "전화 상담"),
  openMenu: L("打开菜单", "Open menu", "ເປີດເມນູ", "메뉴 열기"),
  closeMenu: L("关闭菜单", "Close menu", "ປິດເມນູ", "메뉴 닫기"),
  topbarLeft: L(
    "与老挝建国阵线合作办学 · 2020 年成立于万象",
    "In partnership with the Lao Front for National Development · Founded 2020 in Vientiane",
    "ຮ່ວມກັບແນວລາວສ້າງຊາດ · ສ້າງຕັ້ງປີ 2020 ທີ່ວຽງຈັນ",
    "라오스건국전선과 협력 · 2020년 비엔티안 설립",
  ),
  topbarConsult: L("招生咨询", "Admissions", "ປຶກສາການຮັບສະໝັກ", "입학 상담"),
  language: L("语言", "Language", "ພາສາ", "언어"),
  languageSwitch: L("切换语言", "Switch language", "ປ່ຽນພາສາ", "언어 변경"),
  yearFounded: L("年成立", "Founded", "ສ້າງຕັ້ງ", "년 설립"),
  missionLabel: L("使命", "Mission", "ພາລະກິດ", "사명"),
  galleryLabel: L("图片长廊", "Gallery", "ຮູບພາບກິດຈະກຳ", "갤러리"),
  galleryUnit: L("张", "photos", "ຮູບ", "장"),
  galleryHint: L(
    "点击图片可放大查看",
    "Click a photo to enlarge",
    "ກົດຮູບເພື່ອຂະຫຍາຍ",
    "사진을 클릭하면 크게 볼 수 있습니다",
  ),
  viewLarger: L("放大查看", "View larger", "ເບິ່ງຂະໜາດໃຫຍ່", "크게 보기"),
  closeLightbox: L("关闭", "Close", "ປິດ", "닫기"),
  prev: L("上一张", "Previous", "ກ່ອນໜ້າ", "이전"),
  next: L("下一张", "Next", "ຕໍ່ໄປ", "다음"),
  coreCourses: L("第一学年课程", "Year 1 curriculum", "ແຜນການຮຽນ ປີທີ 1", "1학년 교육과정"),
  steps: L("报名流程", "How to apply", "ຂັ້ນຕອນການສະໝັກ", "지원 절차"),
  documents: L("报名材料", "Required documents", "ເອກະສານປະກອບ", "제출 서류"),
  tuitionTitle: L("学费标准", "Tuition fees", "ຄ່າທຳນຽມການຮຽນ", "등록금"),
  currency: L("基普", "LAK", "ກີບ", "킵"),
  totalLabel: L("三年合计", "Three-year total", "ລວມ 3 ປີ", "3년 합계"),
  semesterUnit: L(" / 学期", " / term", " / ເທີມ", " / 학기"),
  scholarshipLink: L("奖学金", "Scholarships", "ທຶນການສຶກສາ", "장학금"),
  contactUs: L("联系我们", "Contact us", "ຕິດຕໍ່ເຮົາ", "연락처"),
  demoNote: L(
    "本站为测试站点，内容依据校方文档整理",
    "Test site — content based on the college specification",
    "ເວັບທົດສອບ — ເນື້ອຫາອີງຕາມເອກະສານຂອງວິທະຍາໄລ",
    "테스트 사이트 — 대학 문서를 기준으로 작성",
  ),
};

/** 文档 2.1 Home Page */
export const hero = {
  eyebrow: L(
    "民族职业技术学院 · ETVC",
    "ETHNIC TECHNICAL AND VOCATIONAL COLLEGE",
    "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
    "민족직업기술대학 · ETVC",
  ),
  /** Hero Banner Headline */
  title: L(
    "学中文\n开拓新视野",
    "Learn Chinese,\nOpen a New World",
    "ເປີດໂລກທັດໃຫມ່\nດ້ວຍການຮຽນພາສາຈີນ",
    "중국어를 배우고\n새로운 세상을 열다",
  ),
  /** Subheadline */
  lead: L(
    "民族职业技术学院（ETVC）—— 一所面向优质学子的商务汉语教育机构。",
    "Ethnic Technical and Vocational College (ETVC) — a business Chinese education institution for quality students.",
    "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ (ETVC) - ເປັນສະຖານການສຶກສາພາສາຈີນທຸລະກິດ ໃຫ້ແກ່ນັກສຶກສາທີ່ມີຄຸນນະພາບ",
    "민족직업기술대학(ETVC) — 우수한 학생을 위한 비즈니스 중국어 교육 기관입니다.",
  ),
  primaryCta: { label: ui.applyOnline, href: "#admission" },
  secondaryCta: { label: ui.viewCourses, href: "#academics" },
};

export const heroStats: { value: string; unit: Localized; label: Localized }[] = [
  {
    value: "2020",
    unit: L("年", "", "ປີ", "년"),
    label: L("建校年份", "Founded", "ປີສ້າງຕັ້ງ", "설립 연도"),
  },
  {
    value: "3",
    unit: L("年", "yrs", "ປີ", "년"),
    label: L(
      "高等职业课程学制",
      "Higher Diploma Programme",
      "ຫຼັກສູດວິຊາຊີບຊັ້ນສູງ",
      "고등직업과정",
    ),
  },
  {
    value: "5",
    unit: L("门", "", "ວິຊາ", "과목"),
    label: L("第一学年课程", "Year 1 courses", "ວິຊາປີທີ 1", "1학년 과목"),
  },
  {
    value: "2",
    unit: L("种", "", "ພາສາ", "개"),
    label: L("教学语言（老/中）", "Teaching languages", "ພາສາທີ່ໃຊ້ສອນ", "교육 언어"),
  },
];

/** 文档 Announcement Banner */
export const announcement = {
  text: L(
    "三年制高等职业课程 2026-2027 学年招生中",
    "Enrolment open — Higher Diploma Programme (3 years), academic year 2026-2027",
    "ເປີດຮັບສະໝັກນັກຮຽນ ຫຼັກສູດວິຊາຊີບຊັ້ນສູງ (3 ປີ) ປີການສຶກສາ 2026-2027",
    "고등직업과정(3년제) 2026-2027학년도 신입생 모집 중",
  ),
  deadline: L(
    "报名时间：即日起至 2025 年 09 月 21 日",
    "Applications open now until 21/09/2025",
    "ເປີດຮັບສະໝັກແຕ່ນີ້ ຫາ ວັນທີ 21/09/2025",
    "접수 기간: 현재 ~ 2025년 9월 21일",
  ),
  schoolYear: L("2026-2027 学年", "2026-2027", "ປີການສຶກສາ 2026-2027", "2026-2027학년도"),
};

export const tickerItems: Localized[] = [
  announcement.text,
  announcement.deadline,
  school.slogan,
];

/** 文档 2.2 About Us */
export const about = {
  eyebrow: L("关于我们", "ABOUT US", "ກ່ຽວກັບວິທະຍາໄລ", "대학 소개"),
  title: L(
    "历史与沿革",
    "History & Background",
    "ປະຫວັດ ແລະ ຄວາມເປັນມາ",
    "연혁과 배경",
  ),
  /** 文档第 3 节要求：每张图都要有描述性 alt，便于 Google 图片搜索 */
  imageAlt: L(
    "民族职业技术学院师生合影",
    "Ethnic Technical and Vocational College students and teachers group photo",
    "ຮູບລວມອາຈານ ແລະ ນັກຮຽນ ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
    "민족직업기술대학 교사와 학생 단체 사진",
  ),
  paragraphs: [
    L(
      "民族职业技术学院（ETVC）于 2020 年与老挝建国阵线合作成立，双方共同致力于提供高质量的外语教育。这一合作使学院成为语言学习中心，并从中文起步。",
      "Ethnic Technical and Vocational College (ETVC) was established in 2020 through cooperation with the Lao Front for National Development, with a shared vision of providing quality foreign-language education. That cooperation paved the way for the college to become a language learning centre, starting with Chinese.",
      "ວິທະຍາໄລເຕັກນິກ-ວິຊາຊີບຊົນເຜົ່າ (ETVC) ໄດ້ຮັບການສ້າງຕັ້ງຂຶ້ນໂດຍການຮ່ວມມືກັບແນວລາວສ້າງຊາດໃນປີ 2020, ໂດຍມີວິໄສທັດຮ່ວມກັນໃນການສະໜອງການສຶກສາທີ່ມີຄຸນນະພາບທາງດ້ານພາສາຕ່າງປະເທດ. ການຮ່ວມມືດັ່ງກ່າວໄດ້ປູທາງໃຫ້ວິທະຍາໄລຂອງພວກເຮົາກາຍເປັນສູນການຮຽນຮູ້ພາສາ, ເລີ່ມຈາກພາສາຈີນ.",
      "민족직업기술대학(ETVC)은 2020년 라오스건국전선과의 협력을 통해 설립되었으며, 양측은 수준 높은 외국어 교육을 제공하겠다는 비전을 공유했습니다. 이 협력은 대학이 중국어를 시작으로 언어 학습의 중심지가 되는 길을 열었습니다.",
    ),
    L(
      "面对不断增长的汉语需求——尤其是老中经济往来与国际市场的扩大——ETVC 致力于让学生掌握未来机会所需的技能。随着中国在老挝的投资与贸易持续扩大，掌握语言已为无数职业前景打开大门。在 ETVC，我们努力弥合教育与发展中的就业市场之间的差距，让学生有能力在这个互联的世界中取得成功。",
      "Recognising the growing demand for Chinese — especially given Laos–China economic ties and an expanding international market — ETVC is committed to giving students the skills everyone needs for future opportunities. As Chinese investment and trade continue to expand in Laos, knowing the language has opened doors to countless career prospects. At ETVC we work to bridge the gap between education and a developing job market, strengthening students to succeed in a connected world.",
      "ໂດຍຮັບຮູ້ເຖິງຄວາມຕ້ອງການດ້ານພາສາຈີນທີ່ເພີ່ມຂຶ້ນ, ໂດຍສະເພາະກັບສາຍພົວພັນທາງເສດຖະກິດຂອງລາວກັບຈີນ ແລະ ຕະຫຼາດສາກົນທີ່ເພີ່ມຂຶ້ນ, ETVC ມີຄວາມມຸ່ງໝັ້ນທີ່ຈະໃຫ້ນັກຮຽນມີທັກສະທີ່ທຸກຄົນຕ້ອງການສໍາລັບໂອກາດໃນອະນາຄົດ. ໃນຂະນະທີ່ການລົງທຶນ ແລະ ການຄ້າຂອງຈີນ ສືບຕໍ່ຂະຫຍາຍໂຕຢູ່ລາວ, ການຮູ້ພາສາໄດ້ເປີດປະຕູສູ່ຄວາມສົດໃສດ້ານອາຊີບນັບບໍ່ຖ້ວນ. ຢູ່ທີ່ ETVC, ພວກເຮົາພະຍາຍາມເຊື່ອມຕໍ່ຊ່ອງຫວ່າງລະຫວ່າງການສຶກສາ ແລະ ການຕະຫຼາດວຽກທີ່ພວມພັດທະນາ, ສ້າງຄວາມເຂັ້ມແຂງໃຫ້ນັກຮຽນເພື່ອປະສົບຜົນສຳເລັດໃນໂລກທີ່ເຊື່ອມຕໍ່ກັນ.",
      "중국어 수요, 특히 라오스–중국 경제 교류와 국제 시장의 확대에 따라 ETVC는 학생들이 미래의 기회에 필요한 역량을 갖추도록 힘쓰고 있습니다. 라오스에서 중국의 투자와 무역이 계속 확대되면서 중국어는 수많은 진로의 문을 열어 주었습니다. ETVC는 교육과 발전하는 노동시장 사이의 간극을 이어 학생들이 연결된 세계에서 성공할 수 있도록 돕습니다.",
    ),
  ],
  facts: [
    {
      label: L("成立时间", "Founded", "ປີສ້າງຕັ້ງ", "설립"),
      value: L("2020 年", "2020", "ປີ 2020", "2020년"),
    },
    {
      label: L("合作单位", "Partner", "ຄູ່ຮ່ວມມື", "협력 기관"),
      value: L("老挝建国阵线", "Lao Front for National Development", "ແນວລາວສ້າງຊາດ", "라오스건국전선"),
    },
    {
      label: L("校址", "Campus", "ທີ່ຕັ້ງ", "캠퍼스"),
      value: L(
        "万象市赛塔尼县永坎村",
        "Ban Viengkham, Xaythany, Vientiane",
        "ບ້ານວຽງແກ້ວ, ເມືອງໄຊທານີ, ວຽງຈັນ",
        "비엔티안 사이타니현 비엥캄",
      ),
    },
    {
      label: L("办学方向", "Focus", "ຈຸດສຸມ", "교육 방향"),
      value: L(
        "商务汉语 + 职业教育",
        "Business Chinese + vocational training",
        "ພາສາຈີນທຸລະກິດ + ວິຊາຊີບ",
        "비즈니스 중국어 + 직업교육",
      ),
    },
  ],
  /** 文档 Mission 三条 */
  missions: [
    {
      no: "01",
      title: L(
        "高质量课程",
        "Quality teaching",
        "ຈັດຕັ້ງການຮຽນ-ການສອນ",
        "양질의 교육",
      ),
      desc: L(
        "开设高质量的商务汉语与职业课程。",
        "Organising high-quality business Chinese and vocational courses.",
        "ຈັດຕັ້ງການຮຽນ-ການສອນ ຫຼັກສູດພາສາຈີນທຸລະກິດ ແລະ ວິຊາຊີບທີ່ມີຄຸນນະພາບ.",
        "비즈니스 중국어와 직업 과정을 높은 수준으로 운영합니다.",
      ),
    },
    {
      no: "02",
      title: L(
        "企业实训",
        "Real internships",
        "ການຝຶກງານສະຖານປະກອບການຈິງ",
        "기업 실습",
      ),
      desc: L(
        "在企业真岗实训，积累工作经验。",
        "Internships in real companies to build work experience.",
        "ການຝຶກງານສະຖານປະກອບການຈິງ ເພື່ອສ້າງປະສົບການເຮັດວຽກ.",
        "실제 기업에서 실습하여 업무 경험을 쌓습니다.",
      ),
    },
    {
      no: "03",
      title: L(
        "文化传承",
        "Cultural promotion",
        "ສົ່ງເສີມວັດທະນະທຳ",
        "문화 계승",
      ),
      desc: L(
        "弘扬老挝各民族文化和中国文化。",
        "Promoting the cultures of Laos' ethnic groups and Chinese culture.",
        "ສົ່ງເສີມວັດທະນະທຳລາວບັນດາເຜົ່າ ແລະ ວັດທະນະທຳຈີນ.",
        "라오스 여러 민족의 문화와 중국 문화를 알립니다.",
      ),
    },
  ],
};

/** 文档 2.3 Academics */
export const academics = {
  eyebrow: L("课程设置", "ACADEMICS", "ຫຼັກສູດການຮຽນ-ການສອນ", "교육과정"),
  title: L(
    "三年制高等职业课程",
    "Higher Diploma Programme (3 years)",
    "ຫຼັກສູດວິຊາຊີບຊັ້ນສູງ 3 ປີ",
    "3년제 고등직업과정",
  ),
  systemLabel: L("课程体系", "Programme", "ລະບົບຫຼັກສູດ", "교육 체계"),
  systemValue: L(
    "三年制高等职业课程（Higher Diploma Program）",
    "Higher Diploma Programme (3 years)",
    "ຫຼັກສູດວິຊາຊີບຊັ້ນສູງ 3 ປີ (Higher Diploma Program)",
    "3년제 고등직업과정 (Higher Diploma Program)",
  ),
  timeLabel: L("上课时间", "Class hours", "ເວລາຮຽນ", "수업 시간"),
  timeValue: L(
    "周一至周五 8:00 - 12:00",
    "Monday – Friday, 8:00 – 12:00",
    "ວັນຈັນ - ວັນສຸກ | ເວລາ: 8:00 - 12:00",
    "월요일 – 금요일, 8:00 – 12:00",
  ),
  year1Label: L("第一学年课程", "Year 1 curriculum", "ແຜນການຮຽນ ປີທີ 1", "1학년 교육과정"),
  courses: [
    { name: L("听力", "Listening", "ການຟັງ", "듣기") },
    { name: L("口语", "Speaking", "ການເວົ້າ", "말하기") },
    { name: L("阅读", "Reading", "ການອ່ານ", "읽기") },
    { name: L("写作", "Writing", "ການຂຽນ", "쓰기") },
    { name: L("商务汉语", "Business Chinese", "ພາສາຈີນທຸລະກິດ", "비즈니스 중국어") },
  ],
  image: {
    src: "/images/classroom.jpg",
    alt: L(
      "民族职业技术学院课堂：教师与学生互动",
      "Classroom and teacher interaction at ETVC",
      "ຫ້ອງຮຽນ ແລະ ການປະສານງານລະຫວ່າງອາຈານກັບນັກຮຽນ ທີ່ ETVC",
      "ETVC 교실에서 교사와 학생이 소통하는 모습",
    ),
  },
};

/** 文档 2.4 Admissions & Tuition */
export const admissions = {
  eyebrow: L("招生与学费", "ADMISSIONS & TUITION", "ການຮັບສະໝັກ & ຄ່າທຳນຽມ", "입학·등록금"),
  title: L(
    "报名流程与收费标准",
    "How to apply & what it costs",
    "ຂັ້ນຕອນການສະໝັກ ແລະ ຄ່າທຳນຽມ",
    "지원 절차와 등록금",
  ),
  steps: [
    {
      no: "1",
      title: L("在线报名", "Apply online", "ສະໝັກອອນໄລນ໌", "온라인 지원"),
    },
    {
      no: "2",
      title: L(
        "面试（线上或到校）",
        "Interview (online or on campus)",
        "ສຳພາດ (Online/ຢູ່ສະຖາບັນ)",
        "면접(온라인 또는 방문)",
      ),
    },
    {
      no: "3",
      title: L(
        "注册并提交材料",
        "Register & submit documents",
        "ລົງທະບຽນ & ຍື່ນເອກະສານ",
        "등록 및 서류 제출",
      ),
    },
  ],
  documents: [
    L("高中毕业证（ม.7）", "Grade 12 (M.7) certificate", "ໃບປະກາດ ມ.7", "М.7 졸업증명서"),
    L("成绩单", "Transcript", "ໃບຄະແນນ", "성적증명서"),
    L("个人简历（CV）", "CV", "ຊີວະປະຫວັດ (CV)", "이력서(CV)"),
    L(
      "户口本 / 身份证",
      "Family book / ID card",
      "ສຳມະໂນຄົວ/ບັດປະຈຳຕົວ",
      "호구부 / 신분증",
    ),
    L("3×4 证件照 2 张", "Two 3×4 photos", "ຮູບ 3x4 (2 ໃບ)", "3×4 사진 2장"),
  ],
  tuitionHeaders: {
    year: L("学年", "Year", "ຊັ້ນປີ", "학년"),
    annual: L("全年学费", "Total per year", "ຄ່າຮຽນທັງໝົດ / ປີ", "연간 총액"),
    split: L(
      "分期（2 学期）",
      "Split payment (2 terms)",
      "ການແບ່ງຈ່າຍ (2 ເທີມ)",
      "분납 (2학기)",
    ),
  },
  tuitionCaption: L(
    "2026-2027 学年三年制高等职业课程学费标准（单位：基普 LAK）",
    "Tuition for the 2026-2027 Higher Diploma Programme (in Lao kip, LAK)",
    "ອັດຕາຄ່າທຳນຽມການຮຽນ ຫຼັກສູດຊັ້ນສູງ 3 ປີ ປີການສຶກສາ 2026-2027 (ຫົວໜ່ວຍ: ກີບ)",
    "2026-2027학년도 3년제 과정 등록금 (단위: 라오스 키프 LAK)",
  ),
  rows: [
    {
      year: L("第一学年", "Year 1", "ປີທີ 1", "1학년"),
      annual: "6,300,000",
      semester: "3,150,000",
    },
    {
      year: L("第二学年", "Year 2", "ປີທີ 2", "2학년"),
      annual: "6,930,000",
      semester: "3,465,000",
    },
    {
      year: L("第三学年", "Year 3", "ປີທີ 3", "3학년"),
      annual: "7,245,000",
      semester: "3,623,000",
    },
  ],
  total: "20,475,000",
};

/** 文档 2.5 Student Life & Photo Gallery */
export const gallery = {
  eyebrow: L(
    "学生生活与图库",
    "STUDENT LIFE & GALLERY",
    "ກິດຈະກຳ & ຮູບພາບ",
    "학생 생활 & 갤러리",
  ),
  title: L(
    "校园活动与日常",
    "Campus activities and everyday life",
    "ກິດຈະກຳໃນວິທະຍາໄລ ແລະ ຊີວິດປະຈຳວັນ",
    "캠퍼스 활동과 일상",
  ),
  items: [
    {
      src: "/images/campus-hero.jpg",
      tag: "CAMPUS",
      label: L("校园主楼", "Campus", "ອາຄານຫຼັກ", "본관"),
      alt: L(
        "民族职业技术学院校园主教学楼航拍",
        "Ethnic Technical and Vocational College campus",
        "ອາຄານຮຽນຫຼັກ ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ",
        "민족직업기술대학 본관 교육동 항공 사진",
      ),
    },
    {
      src: "/images/gallery-songkran.jpg",
      tag: "FESTIVAL",
      label: L("泼水节", "Pi Mai festival", "ບຸນປີໃໝ່ລາວ", "삐마이 축제"),
      alt: L(
        "老中学生在泼水节活动中互相洒水祝福",
        "Lao and Chinese student activities at the Pi Mai festival",
        "ນັກຮຽນລາວ-ຈີນ ໃນກິດຈະກຳບຸນປີໃໝ່ລາວ",
        "삐마이 축제에서 라오스·중국 학생들이 물을 뿌리며 축하하는 모습",
      ),
    },
    {
      src: "/images/students-sports.jpg",
      tag: "SPORTS",
      label: L("校园篮球赛", "Basketball", "ການແຂ່ງບາສເກດ", "농구 경기"),
      alt: L(
        "学生在校园球场参加篮球赛",
        "Students playing basketball on the campus court",
        "ນັກຮຽນແຂ່ງບາສເກດໃນສະໜາມຂອງວິທະຍາໄລ",
        "캠퍼스 코트에서 농구 경기를 하는 학생들",
      ),
    },
    {
      src: "/images/gallery-kayaking.jpg",
      tag: "OUTDOOR",
      label: L("皮划艇拓展", "Kayaking", "ກິດຈະກຳພາຍເຮືອ", "카약 체험"),
      alt: L(
        "学生参加皮划艇户外拓展活动",
        "Students on a kayaking outdoor activity",
        "ນັກຮຽນເຂົ້າຮ່ວມກິດຈະກຳພາຍເຮືອ",
        "야외 카약 체험에 참여한 학생들",
      ),
    },
    {
      src: "/images/classroom.jpg",
      tag: "CLASS",
      label: L("课堂互动", "Classroom", "ຫ້ອງຮຽນ", "수업"),
      alt: L(
        "教师与学生在课堂上互动",
        "Teacher and students interacting in class",
        "ອາຈານ ແລະ ນັກຮຽນ ປະສານງານໃນຫ້ອງຮຽນ",
        "교실에서 교사와 학생이 소통하는 모습",
      ),
    },
    {
      src: "/images/gallery-trip.jpg",
      tag: "FIELD TRIP",
      label: L("校外活动", "Field trip", "ກິດຈະກຳນອກສະຖານ", "현장 활동"),
      alt: L(
        "学生校外活动合影",
        "Group photo from a student field trip",
        "ຮູບລວມກິດຈະກຳນອກສະຖານ",
        "현장 활동 단체 사진",
      ),
    },
  ],
};

/** 文档 2.6 Student Life & Welfare：奖学金（50 ທຶນຕໍ່ປີ） */
export const welfare = {
  eyebrow: L(
    "学生福利与奖学金",
    "STUDENT LIFE & WELFARE",
    "ສະຫວັດດີການ & ທຶນການສຶກສາ",
    "학생 복지 & 장학금",
  ),
  title: L("奖学金", "Scholarships", "ທຶນການສຶກສາ", "장학금"),
  /** 每年奖学金名额（AI 客服与结构化数据共用，改这里即可同步） */
  quota: 50,
  badge: L("每年 50 个名额", "50 scholarships per year", "50 ທຶນຕໍ່ປີ", "매년 50명"),
  intro: L(
    "民族职业技术学院以回馈社会、资助并推动老挝青少年教育为愿景，每年提供 50 个助学奖学金，让教育机会更加普及。",
    "Ethnic Technical and Vocational College has a vision of contributing to, supporting and advancing education for Lao youth by granting 50 scholarships per year, widening access to education for all.",
    "ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ ມີວິໄສທັດໃນການປະກອບສ່ວນ ຊ່ວຍເຫຼືອ ແລະ ຊຸກຍູ້ການສຶກສາໃຫ້ແກ່ເຍົາວະຊົນລາວ ໂດຍການມອບທຶນການສຶກສາຊ່ວຍເຫຼືອ ຈຳນວນ 50 ທຶນຕໍ່ປີ ເພື່ອຂະຫຍາຍໂອກາດທາງການສຶກສາຢ່າງທົ່ວເຖິງ:",
    "민족직업기술대학은 라오스 청소년 교육을 지원하고 발전시키고자 매년 50명 규모의 장학금을 지급하여 교육 기회를 넓히고 있습니다.",
  ),
  items: [
    {
      no: "01",
      icon: "award" as const,
      title: L(
        "优秀学生奖学金",
        "Merit scholarship",
        "ທຶນນັກຮຽນເກັ່ງ",
        "성적 우수 장학금",
      ),
      desc: L(
        "面向高中毕业（ม.7）且成绩优异（7 分以上）的学生，以鼓励其能力发展。",
        "Awarded to M.7 graduates with outstanding results (7 or above) to encourage their ability.",
        "ມອບໃຫ້ຮຽນຈົບ ມ.7 ທີ່ມີຜົນການຮຽນດີເດັ່ນ (ໄດ້ 7 ຢ່າງຂຶ້ນໄປ) ເພື່ອສົ່ງເສີມຄວາມສາມາດ.",
        "М.7 졸업생 중 성적이 우수한(7점 이상) 학생에게 지급하여 능력을 장려합니다.",
      ),
    },
    {
      no: "02",
      icon: "heart" as const,
      title: L(
        "贫困 / 失学学生助学金",
        "Need-based grant",
        "ທຶນນັກຮຽນທຸກຍາກ/ຂາດໂອກາດ",
        "저소득·교육 기회 취약 장학금",
      ),
      desc: L(
        "面向热爱学习、有求学决心但缺乏学费的学生。",
        "Awarded to those who love learning and are committed to study but lack the funds to do so.",
        "ມອບໃຫ້ຜູ້ທີ່ມີຄວາມຮັກ ແລະ ມຸ່ງໝັ້ນໃນການສຶກສາ ແຕ່ຂາດແຄນທຶນຮອນໃນການຮ່ຳຮຽນ.",
        "배움에 대한 열정과 의지는 있으나 학비가 부족한 학생에게 지급합니다.",
      ),
    },
    {
      no: "03",
      icon: "mountain" as const,
      title: L(
        "少数民族学生奖学金",
        "Ethnic minority scholarship",
        "ທຶນນັກຮຽນຊົນເຜົ່າ",
        "소수민족 장학금",
      ),
      desc: L(
        "面向偏远地区的少数民族青少年，为其创造职业与语言发展的机会。",
        "Awarded to ethnic minority youth in remote areas, creating opportunities to develop vocational and language skills.",
        "ມອບໃຫ້ເຍົາວະຊົນຊົນເຜົ່າທີ່ຢູ່ເຂດຫ່າງໄກສອກຫຼີກ ເພື່ອສ້າງໂອກາດໃນການພັດທະນາວິຊາຊີບ ແລະ ພາສາ.",
        "오지에 사는 소수민족 청소년에게 직업과 언어 발전의 기회를 제공합니다.",
      ),
    },
  ],
  /** 文档 2.6 附的校方奖学金海报（老挝语原图） */
  poster: {
    src: "/images/scholarship-poster.jpg",
    alt: L(
      "民族职业技术学院奖学金政策海报（老挝语）：三类奖学金与咨询电话",
      "ETVC scholarship policy poster (in Lao) with the three scholarship types and contact numbers",
      "ໂປສເຕີທຶນການສຶກສາ ຂອງວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ: ທຶນ 3 ປະເພດ ແລະ ເບີໂທຕິດຕໍ່",
      "민족직업기술대학 장학금 안내 포스터(라오어): 세 가지 장학금과 문의 전화",
    ),
    label: L(
      "奖学金政策海报",
      "Scholarship poster",
      "ໂປສເຕີທຶນການສຶກສາ",
      "장학금 안내 포스터",
    ),
    caption: L(
      "校方发布的奖学金政策海报（老挝语原文）",
      "Official scholarship poster published by the college (in Lao)",
      "ໂປສເຕີທຶນການສຶກສາທາງການຂອງວິທະຍາໄລ",
      "대학이 공식 배포한 장학금 안내 포스터(라오어 원문)",
    ),
    hint: L(
      "点击查看大图",
      "Click to view full size",
      "ກົດເພື່ອເບິ່ງຂະໜາດໃຫຍ່",
      "클릭하면 크게 볼 수 있습니다",
    ),
    contactLabel: L(
      "详情咨询",
      "More information",
      "ສອບຖາມຂໍ້ມູນເພີ່ມເຕີມ",
      "문의",
    ),
  },
};

/** 文档 2.7 Contact Us */
export const contact = {
  eyebrow: L("联系我们", "CONTACT US", "ຕິດຕໍ່ເຮົາ", "연락처"),
  title: L("联系我们", "Contact us", "ຕິດຕໍ່ເຮົາ", "연락처"),
  labels: {
    address: L("地址", "Address", "ທີ່ຕັ້ງສະຖາບັນ", "주소"),
    phone: L("电话 / WhatsApp", "Phone / WhatsApp", "WhatsApp / Phone", "전화 / WhatsApp"),
    facebook: L("Facebook", "Facebook", "Facebook", "Facebook"),
  },
  addresses: {
    lo: [
      { text: "ບ້ານວຽງແກ້ວ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ", lang: "lo" },
      { text: "Ban Viengkham, Xaythany District, Vientiane Capital", lang: "en" },
    ],
    zh: [
      { text: "老挝万象市赛塔尼县永坎村", lang: "zh-CN" },
      { text: "ບ້ານວຽງແກ້ວ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ", lang: "lo" },
      { text: "Ban Viengkham, Xaythany District, Vientiane Capital", lang: "en" },
    ],
    en: [
      { text: "Ban Viengkham, Xaythany District, Vientiane Capital", lang: "en" },
      { text: "ບ້ານວຽງແກ້ວ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ", lang: "lo" },
    ],
    ko: [
      { text: "라오스 비엔티안 수도 사이타니현 비엥캄 마을", lang: "ko" },
      { text: "ບ້ານວຽງແກ້ວ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ", lang: "lo" },
    ],
  } as Record<string, { text: string; lang: string }[]>,
  addressEn: "Ban Viengkham, Xaythany District, Vientiane Capital",
  phones: [
    { value: "+856 20 5825 8055", tel: "+8562058258055" },
    { value: "+856 20 5587 2937", tel: "+8562055872937" },
    // 校方奖学金海报上公布的第三个咨询号
    { value: "+856 20 5995 9674", tel: "+8562059959674" },
  ],
  facebook: {
    value: "Ethnic Technical and Vocational College",
    // 文档只给了主页名，没有主页链接；先指向该主页名的 Facebook 搜索页
    href: "https://www.facebook.com/search/top?q=Ethnic%20Technical%20and%20Vocational%20College",
  },
  qr: {
    image: "/images/qr-register.png",
    href: "https://forms.gle/6QwPsjyHWAd4qcqq9",
    label: L("扫码在线报名", "Scan to apply online", "ສະແກນ QR ເພື່ອສະໝັກ", "QR 스캔 후 온라인 지원"),
    desc: L(
      "用手机扫码填写报名信息，招生老师会与你联系。",
      "Scan with your phone, fill in the form, and the admissions team will contact you.",
      "ສະແກນດ້ວຍມືຖື, ຕື່ມຂໍ້ມູນ ແລ້ວອາຈານຮັບສະໝັກຈະຕິດຕໍ່ກັບທ່ານ.",
      "휴대폰으로 스캔해 지원서를 작성하시면 입학 담당자가 연락드립니다.",
    ),
    cta: L(
      "打开在线报名表",
      "Open the application form",
      "ເປີດແບບຟອມສະໝັກ",
      "온라인 지원서 열기",
    ),
    alt: L(
      "民族职业技术学院在线报名二维码",
      "QR code for the ETVC online application form",
      "QR ສະໝັກອອນລາຍ ຂອງວິທະຍາໄລ",
      "민족직업기술대학 온라인 지원 QR 코드",
    ),
  },
};

export const footer = {
  columns: [
    {
      title: L("关于学院", "About", "ກ່ຽວກັບວິທະຍາໄລ", "대학 소개"),
      links: [
        L("历史与沿革", "History", "ປະຫວັດ", "연혁"),
        L("使命", "Mission", "ພາລະກິດ", "사명"),
        L("校园生活", "Campus life", "ຊີວິດໃນວິທະຍາໄລ", "캠퍼스 생활"),
      ],
    },
    {
      title: L("课程与学费", "Programmes & fees", "ຫຼັກສູດ ແລະ ຄ່າຮຽນ", "교육과정·등록금"),
      links: [
        L("三年制高职课程", "Higher Diploma", "ຫຼັກສູດ 3 ປີ", "3년제 과정"),
        L("第一学年课程", "Year 1 curriculum", "ແຜນການຮຽນ ປີທີ 1", "1학년 교육과정"),
        L("学费标准", "Tuition", "ຄ່າທຳນຽມ", "등록금"),
        L("奖学金", "Scholarships", "ທຶນການສຶກສາ", "장학금"),
      ],
    },
    {
      title: L("招生", "Admissions", "ການຮັບສະໝັກ", "입학"),
      links: [
        L("2026-2027 招生", "2026-2027 intake", "ຮັບສະໝັກ 2026-2027", "2026-2027 입학"),
        L("报名流程", "How to apply", "ຂັ້ນຕອນການສະໝັກ", "지원 절차"),
        L("报名材料", "Documents", "ເອກະສານປະກອບ", "제출 서류"),
        L("报名截止", "Deadline", "ກຳນົດຮັບສະໝັກ", "접수 마감"),
      ],
    },
  ],
  admissionTitle: L("2026-2027 招生", "2026-2027 intake", "ຮັບສະໝັກ 2026-2027", "2026-2027 입학"),
  partnerLine: L(
    "与老挝建国阵线合作办学",
    "In partnership with the Lao Front for National Development",
    "ຮ່ວມກັບແນວລາວສ້າງຊາດ",
    "라오스건국전선과 협력",
  ),
};

/**
 * AI 智能客服 UI 文案
 * 注意：这里只放界面文字；客服回答的“事实”来自本文件其余部分，
 * 由 lib/knowledge.ts 汇总成 System Prompt。
 */
export const chat = {
  launcher: L("在线咨询", "Chat with us", "ສອບຖາມ", "채팅 상담"),
  title: L(
    "招生咨询助手",
    "Admissions assistant",
    "ຜູ້ຊ່ວຍປຶກສາການຮັບສະໝັກ",
    "입학 상담 도우미",
  ),
  subtitle: L(
    "依据学校官方资料回答",
    "Answers based on official college data",
    "ຕອບຕາມຂໍ້ມູນທາງການຂອງວິທະຍາໄລ",
    "대학 공식 자료 기반",
  ),
  greeting: L(
    "你好！我是民族职业技术学院的招生咨询助手，可以回答学费、奖学金、课程、报名和联系方式等问题。请问你想了解什么？",
    "Hello! I'm the admissions assistant for Ethnic Technical and Vocational College. I can help with tuition, scholarships, the programme, applications and contact details. What would you like to know?",
    "ສະບາຍດີ! ຂ້ອຍເປັນຜູ້ຊ່ວຍປຶກສາການຮັບສະໝັກ ຂອງວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ. ສາມາດຕອບຄຳຖາມກ່ຽວກັບຄ່າຮຽນ, ທຶນການສຶກສາ, ຫຼັກສູດ, ການສະໝັກ ແລະ ການຕິດຕໍ່ໄດ້. ທ່ານຢາກຮູ້ຫຍັງແດ່?",
    "안녕하세요! 민족직업기술대학 입학 상담 도우미입니다. 등록금, 장학금, 교육과정, 지원 방법, 연락처 등을 안내해 드릴 수 있습니다. 무엇을 알고 싶으신가요?",
  ),
  placeholder: L(
    "输入你的问题…",
    "Type your question…",
    "ພິມຄຳຖາມຂອງທ່ານ…",
    "질문을 입력하세요…",
  ),
  send: L("发送", "Send", "ສົ່ງ", "전송"),
  close: L("关闭", "Close", "ປິດ", "닫기"),
  thinking: L("正在回答…", "Thinking…", "ກຳລັງຕອບ…", "답변 작성 중…"),
  quickLabel: L(
    "常见问题",
    "Common questions",
    "ຄຳຖາມທີ່ພົບເລື້ອຍ",
    "자주 묻는 질문",
  ),
  error: L(
    "暂时无法连接，请稍后再试，或直接致电招生老师。",
    "Connection failed. Please try again, or call the admissions team directly.",
    "ເຊື່ອມຕໍ່ບໍ່ໄດ້, ກະລຸນາລອງໃໝ່ ຫຼື ໂທຫາອາຈານຮັບສະໝັກໂດຍກົງ.",
    "연결에 실패했습니다. 다시 시도하시거나 입학 담당자에게 전화해 주세요.",
  ),
  disclaimer: L(
    "回答由 AI 生成，最终以学校官方信息为准",
    "AI-generated — official college information prevails",
    "ຄຳຕອບສ້າງໂດຍ AI, ໃຫ້ອີງຕາມຂໍ້ມູນທາງການ",
    "AI가 생성한 답변이며 공식 정보를 기준으로 합니다",
  ),
  /** 快捷提问：label 是按钮文字，question 是实际发送给模型的问题 */
  quick: [
    {
      label: L("学费", "Tuition", "ຄ່າຮຽນ", "등록금"),
      question: L(
        "三年制的学费是多少？可以分期缴吗？",
        "How much does the three-year programme cost? Can I pay in instalments?",
        "ຄ່າຮຽນຫຼັກສູດ 3 ປີ ແມ່ນເທົ່າໃດ? ແບ່ງຈ່າຍໄດ້ບໍ່?",
        "3년제 등록금은 얼마인가요? 분납할 수 있나요?",
      ),
    },
    {
      label: L("奖学金", "Scholarships", "ທຶນການສຶກສາ", "장학금"),
      question: L(
        "奖学金有哪些？怎么申请？",
        "What scholarships are available and how do I apply?",
        "ມີທຶນການສຶກສາຫຍັງແດ່? ສະໝັກແນວໃດ?",
        "장학금에는 어떤 것이 있고 어떻게 신청하나요?",
      ),
    },
    {
      label: L("地址与联系", "Location", "ທີ່ຢູ່", "위치·연락처"),
      question: L(
        "学校地址在哪里？怎么联系？",
        "Where is the campus and how can I contact you?",
        "ວິທະຍາໄລຢູ່ໃສ? ຕິດຕໍ່ແນວໃດ?",
        "학교 주소가 어디이고 어떻게 연락하나요?",
      ),
    },
    {
      label: L("报名方式", "How to apply", "ການສະໝັກ", "지원 방법"),
      question: L(
        "怎么报名？需要准备哪些材料？",
        "How do I apply and what documents do I need?",
        "ສະໝັກຮຽນແນວໃດ? ຕ້ອງກຽມເອກະສານຫຍັງແດ່?",
        "어떻게 지원하고 어떤 서류가 필요한가요?",
      ),
    },
  ],
};

/**
 * 常见问题（FAQ）
 * 同时用于页面展示与 FAQPage 结构化数据，是 GEO（生成式引擎优化）最有效的抓手：
 * 问答成对、事实明确、可直接被 AI 摘要引用。
 */
export const faq = {
  eyebrow: L("常见问题", "FAQ", "ຄຳຖາມທີ່ພົບເລື້ອຍ", "자주 묻는 질문"),
  title: L(
    "招生与就读常见问题",
    "Admissions & study FAQ",
    "ຄຳຖາມກ່ຽວກັບການສະໝັກ ແລະ ການຮຽນ",
    "입학·재학 관련 자주 묻는 질문",
  ),
  intro: L(
    "以下回答依据校方公布的信息整理，如与最新公告不一致，以校方公告为准。",
    "The answers below are compiled from official college information. Where they differ from the latest notice, the official notice prevails.",
    "ຄຳຕອບຂ້າງລຸ່ມນີ້ອີງຕາມຂໍ້ມູນທີ່ສະຖາບັນປະກາດ; ຫາກຂັດກັບປະກາດລ່າສຸດ ໃຫ້ຖືປະກາດຂອງສະຖາບັນເປັນຫຼັກ.",
    "아래 답변은 학교 공식 정보를 정리한 것입니다. 최신 공지와 다를 경우 공지를 우선합니다.",
  ),
  items: [
    {
      q: L(
        "什么时候可以报名？招生截止到什么时候？",
        "When can I apply, and what is the application deadline?",
        "ສະໝັກໄດ້ເມື່ອໃດ? ປິດຮັບສະໝັກເມື່ອໃດ?",
        "언제 지원할 수 있고 접수 마감은 언제인가요?",
      ),
      a: L(
        "2026—2027 学年三年制高等职业课程正在招生，报名现已开放。具体截止日期请以校方最新公告为准，可扫描官网二维码在线报名，或致电招生老师确认。",
        "Enrolment for the 2026-2027 Higher Diploma Programme is open now. For the exact closing date, please refer to the college's latest notice; you can apply online via the QR code on this site or call the admissions team to confirm.",
        "ການຮັບສະໝັກຫຼັກສູດຊັ້ນສູງ 3 ປີ ປີການສຶກສາ 2026-2027 ເປີດແລ້ວ. ວັນປິດຮັບສະໝັກ ໃຫ້ອີງຕາມປະກາດລ່າສຸດຂອງສະຖາບັນ; ສາມາດສະໝັກອອນລາຍຜ່ານ QR ໃນເວັບໄຊ ຫຼື ໂທຫາອາຈານຮັບສະໝັກເພື່ອຢືນຢັນ.",
        "2026-2027학년도 3년제 고등직업과정 모집이 진행 중입니다. 정확한 마감일은 학교 최신 공지를 확인하시고, 홈페이지 QR코드로 온라인 지원하거나 입학 담당자에게 전화로 문의하세요.",
      ),
    },
    {
      q: L(
        "学费是多少？可以分期缴纳吗？",
        "How much is the tuition? Can I pay in instalments?",
        "ຄ່າຮຽນເທົ່າໃດ? ແບ່ງຈ່າຍໄດ້ບໍ່?",
        "등록금은 얼마이며 분납이 가능한가요?",
      ),
      a: L(
        "三年制课程学费按学年收取：第一学年 6,300,000 基普，第二学年 6,930,000 基普，第三学年 7,245,000 基普，三年合计 20,475,000 基普。可以一次性缴清，也可以分两个学期缴纳。",
        "Tuition is charged per academic year: Year 1 is 6,300,000 LAK, Year 2 is 6,930,000 LAK and Year 3 is 7,245,000 LAK, totalling 20,475,000 LAK for three years. You may pay in full or split the payment across two semesters.",
        "ຄ່າທຳນຽມເກັບຕາມປີການສຶກສາ: ປີທີ 1 6,300,000 ກີບ, ປີທີ 2 6,930,000 ກີບ, ປີທີ 3 7,245,000 ກີບ, ລວມ 3 ປີ 20,475,000 ກີບ. ສາມາດຈ່າຍຄັ້ງດຽວ ຫຼື ແບ່ງຈ່າຍ 2 ເທີມ.",
        "등록금은 학년별로 납부합니다. 1학년 6,300,000킵, 2학년 6,930,000킵, 3학년 7,245,000킵이며 3년 총액은 20,475,000킵입니다. 일시납 또는 2학기 분납이 가능합니다.",
      ),
    },
    {
      q: L(
        "学校有奖学金吗？怎么申请？",
        "Does the college offer scholarships? How do I apply?",
        "ມີທຶນການສຶກສາບໍ? ສະໝັກແນວໃດ?",
        "장학금이 있나요? 어떻게 신청하나요?",
      ),
      a: L(
        "有。学校每年提供 50 个奖学金名额，分为优秀学生奖学金（面向高中毕业成绩 7 分以上的学生）和面向贫困、失学学生的助学金。可在报名时向招生老师提出申请，具体评定标准以校方公布为准。",
        "Yes. The college grants 50 scholarships every year: merit scholarships for M.7 graduates with results of 7 or above, and need-based grants for students from low-income families or those who have missed out on schooling. Apply through the admissions team when you enrol; assessment criteria follow the college's published rules.",
        "ມີ. ສະຖາບັນມອບທຶນການສຶກສາ 50 ທຶນຕໍ່ປີ: ທຶນນັກຮຽນເກັ່ງ (ສຳລັບຜູ້ຈົບ ມ.7 ທີ່ໄດ້ 7 ຄະແນນຂຶ້ນໄປ) ແລະ ທຶນຊ່ວຍເຫຼືອນັກຮຽນທຸກຍາກ/ຂາດໂອກາດ. ສະໝັກໄດ້ກັບອາຈານຮັບສະໝັກຕອນລົງທະບຽນ.",
        "네. 매년 50명 규모의 장학금을 지급합니다. 성적 우수 장학금(M.7 졸업 성적 7점 이상)과 저소득·교육 기회 취약 학생을 위한 장학금이 있습니다. 등록 시 입학 담당자에게 신청하면 되고, 심사 기준은 학교 공지를 따릅니다.",
      ),
    },
    {
      q: L(
        "报名需要准备哪些材料？",
        "What documents do I need to apply?",
        "ຕ້ອງກຽມເອກະສານຫຍັງແດ່?",
        "지원 시 어떤 서류가 필요한가요?",
      ),
      a: L(
        "需要准备：高中毕业证（ม.7）、成绩单、个人简历（CV）、户口本或身份证、3×4 证件照 2 张。",
        "You will need: your Grade 12 (M.7) certificate, a transcript, a CV, your family book or ID card, and two 3×4 photographs.",
        "ຕ້ອງກຽມ: ໃບປະກາດ ມ.7, ໃບຄະແນນ, ຊີວະປະຫວັດ (CV), ສຳມະໂນຄົວ ຫຼື ບັດປະຈຳຕົວ, ຮູບ 3x4 ຈຳນວນ 2 ໃບ.",
        "М.7 졸업증명서, 성적증명서, 이력서(CV), 호구부 또는 신분증, 3×4 사진 2장이 필요합니다.",
      ),
    },
    {
      q: L(
        "上课时间怎么安排？都学哪些课程？",
        "What are the class hours and which subjects are taught?",
        "ເວລາຮຽນແນວໃດ? ຮຽນວິຊາໃດແດ່?",
        "수업 시간과 교육 과목은 어떻게 되나요?",
      ),
      a: L(
        "课程为三年制高等职业课程，周一至周五 8:00—12:00 上课。第一学年课程包括听力、口语、阅读、写作和商务汉语。",
        "The programme is a three-year Higher Diploma, with classes Monday to Friday from 8:00 to 12:00. The Year 1 curriculum covers listening, speaking, reading, writing and business Chinese.",
        "ຫຼັກສູດຊັ້ນສູງ 3 ປີ, ຮຽນວັນຈັນ-ວັນສຸກ ເວລາ 8:00-12:00. ປີທີ 1 ຮຽນ: ການຟັງ, ການເວົ້າ, ການອ່ານ, ການຂຽນ ແລະ ພາສາຈີນທຸລະກິດ.",
        "3년제 과정이며 월요일부터 금요일까지 8:00-12:00에 수업합니다. 1학년 과정은 듣기, 말하기, 읽기, 쓰기, 비즈니스 중국어입니다.",
      ),
    },
    {
      q: L(
        "学校在哪里？怎么联系？",
        "Where is the college and how can I contact it?",
        "ສະຖາບັນຢູ່ໃສ? ຕິດຕໍ່ແນວໃດ?",
        "학교 위치와 연락처를 알려주세요.",
      ),
      a: L(
        "校址位于老挝万象市赛塔尼县永坎村（Ban Viengkham, Xaythany District, Vientiane Capital）。咨询电话 / WhatsApp：+856 20 5825 8055、+856 20 5587 2937。",
        "The campus is at Ban Viengkham, Xaythany District, Vientiane Capital, Lao PDR. Phone / WhatsApp: +856 20 5825 8055 and +856 20 5587 2937.",
        "ສະຖາບັນຕັ້ງຢູ່ ບ້ານວຽງແກ້ວ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ. ໂທ / WhatsApp: +856 20 5825 8055, +856 20 5587 2937.",
        "라오스 비엔티안 수도 사이타니현 비엥캄 마을에 있습니다. 전화/WhatsApp: +856 20 5825 8055, +856 20 5587 2937.",
      ),
    },
  ],
};

/**
 * 在线报名表单文案
 * 字段刻意精简到 10 个：每多一栏，放弃率就往上走。
 */
export const apply = {
  eyebrow: L("在线报名", "Apply Online", "ສະໝັກອອນລາຍ", "온라인 지원"),
  title: L(
    "填写资料，招生老师会联系你",
    "Fill in your details and our admissions team will contact you",
    "ຕື່ມຂໍ້ມູນ ແລ້ວອາຈານຮັບສະໝັກຈະຕິດຕໍ່ກັບທ່ານ",
    "정보를 입력하시면 입학 담당자가 연락드립니다",
  ),
  intro: L(
    "提交后 1—3 个工作日内会有老师通过电话或 WhatsApp 联系。资料仅用于招生审核，不会对外公开。",
    "Our team will call or message you on WhatsApp within 1–3 working days. Your details are used for admissions review only and are never shared publicly.",
    "ຫຼັງສົ່ງແລ້ວ ອາຈານຈະໂທ ຫຼື ຕິດຕໍ່ຜ່ານ WhatsApp ພາຍໃນ 1-3 ວັນເຮັດວຽກ. ຂໍ້ມູນໃຊ້ພຽງເພື່ອກວດສອບການສະໝັກ ບໍ່ເຜີຍແຜ່ຕໍ່ສາທາລະນະ.",
    "제출 후 1~3 영업일 내에 담당자가 전화 또는 WhatsApp으로 연락드립니다. 입력하신 정보는 입학 심사 용도로만 사용되며 외부에 공개되지 않습니다.",
  ),
  fields: {
    fullName: L("姓名", "Full name", "ຊື່ ແລະ ນາມສະກຸນ", "이름"),
    phone: L("电话 / WhatsApp", "Phone / WhatsApp", "ເບີໂທ / WhatsApp", "전화 / WhatsApp"),
    gender: L("性别", "Gender", "ເພດ", "성별"),
    birthDate: L("出生日期", "Date of birth", "ວັນເດືອນປີເກີດ", "생년월일"),
    address: L("现住址（省 / 县 / 村）", "Address (province / district / village)", "ທີ່ຢູ່ (ແຂວງ / ເມືອງ / ບ້ານ)", "주소 (성 / 현 / 마을)"),
    highSchool: L("毕业学校", "High school", "ໂຮງຮຽນທີ່ຈົບ", "졸업 고등학교"),
    gradYear: L("毕业年份", "Graduation year", "ປີທີ່ຈົບ", "졸업 연도"),
    gpa: L("毕业成绩", "Graduation score", "ຄະແນນຈົບ", "졸업 성적"),
    note: L("想补充的说明（选填）", "Anything else (optional)", "ລາຍລະອຽດເພີ່ມເຕີມ (ບໍ່ບັງຄັບ)", "추가로 남기실 말 (선택)"),
  },
  genderOptions: {
    male: L("男", "Male", "ຊາຍ", "남성"),
    female: L("女", "Female", "ຍິງ", "여성"),
    other: L("不便说明", "Prefer not to say", "ບໍ່ສະດວກບອກ", "밝히지 않음"),
  },
  scholarship: L(
    "我想申请奖学金（每年 50 个名额）",
    "I want to apply for a scholarship (50 places per year)",
    "ຂ້ອຍຕ້ອງການສະໝັກທຶນການສຶກສາ (50 ທຶນຕໍ່ປີ)",
    "장학금을 신청하고 싶습니다 (매년 50명)",
  ),
  submit: L("提交报名", "Submit application", "ສົ່ງໃບສະໝັກ", "지원서 제출"),
  submitting: L("正在提交…", "Submitting…", "ກຳລັງສົ່ງ…", "제출 중…"),
  successTitle: L("报名已提交", "Application received", "ສົ່ງໃບສະໝັກແລ້ວ", "지원서가 접수되었습니다"),
  successBody: L(
    "我们已收到你的资料，招生老师会在 1—3 个工作日内联系你。如需加急，可直接致电 +856 20 5825 8055。",
    "We have received your details. Our admissions team will contact you within 1–3 working days. For urgent enquiries, call +856 20 5825 8055.",
    "ພວກເຮົາໄດ້ຮັບຂໍ້ມູນແລ້ວ. ອາຈານຮັບສະໝັກຈະຕິດຕໍ່ພາຍໃນ 1-3 ວັນເຮັດວຽກ. ຖ້າຕ້ອງການດ່ວນ ໂທ +856 20 5825 8055.",
    "정보가 접수되었습니다. 입학 담당자가 1~3 영업일 내에 연락드립니다. 급한 문의는 +856 20 5825 8055로 전화하세요.",
  ),
  successAgain: L("再填一份", "Submit another", "ສະໝັກເພີ່ມອີກ", "추가 제출"),
  required: L("必填", "Required", "ຈຳເປັນ", "필수"),
  errors: {
    required: L("请填写必填项", "Please fill in the required fields", "ກະລຸນາຕື່ມຊ່ອງທີ່ຈຳເປັນ", "필수 항목을 입력해 주세요"),
    phone: L("请输入有效的电话号码", "Please enter a valid phone number", "ກະລຸນາໃສ່ເບີໂທທີ່ຖືກຕ້ອງ", "올바른 전화번호를 입력해 주세요"),
    network: L("网络异常，请稍后重试", "Network error, please try again", "ເຄືອຂ່າຍຜິດພາດ, ກະລຸນາລອງໃໝ່", "네트워크 오류입니다. 다시 시도해 주세요"),
    duplicate: L("这个号码刚刚已经提交过，请勿重复报名", "This number has already been submitted recently", "ເບີນີ້ໄດ້ສົ່ງແລ້ວ, ກະລຸນາຢ່າສົ່ງຊ້ຳ", "이 번호로 이미 제출되었습니다"),
  },
};
