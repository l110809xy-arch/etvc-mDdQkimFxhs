# ETVC · 民族职业技术学院（老挝）官网

Ethnic Technical and Vocational College（ETVC）· ວິທະຍາໄລເຕັກນິກວິຊາຊີບຊົນເຜົ່າ

基于 **Next.js 16（App Router）+ React 19 + TypeScript + Tailwind CSS v4** 构建的官网首页。

## 快速开始

```bash
npm run dev     # 开发服务器 http://localhost:3000
npm run build   # 生产构建
npm run start   # 运行生产构建
npm run lint    # ESLint 检查
```

## 页面结构

| 版块 | 锚点 | 内容来源 |
| --- | --- | --- |
| 首屏 | `#top` | 主标题「学中文 开拓新视野」、四组关键数据、招生公告跑马灯（四语） |
| 招生公告 | `#admission` | 2026—2027 学年招生状态与报名截止日期 |
| 关于我们 | `#about` | 2020 年与老挝建国阵线合作建校、办学定位、基本信息表 |
| 三大使命 | — | 高质量课程 / 企业实训实习 / 文化传承交流 |
| 课程设置 | `#academics` | 三年制高等职业专科课程、授课安排、五门核心课程 |
| 学费标准 | `#tuition` | 三年学费表（全年 / 每学期）与合计、缴费说明 |
| 奖学金计划 | `#scholarships` | 每年 50 个名额：优秀学生 / 贫困助学 / 少数民族三类 |
| 校园生活 | `#campus` | 三项校园文化要点 + 6 张图片长廊（3 列响应式网格） |
| 联系我们 | `#contact` | 地址（中/英/老）、电话与 WhatsApp、Facebook、报名二维码 |

## 多语言（四语独立 URL）

支持 **老挝语 / 中文 / 英文 / 韩语** 四种语言。语言由 **URL 决定**，而不是 localStorage：

| 语言 | 地址 |
| --- | --- |
| 中文（默认） | `/` |
| 老挝语 | `/lo` |
| 英文 | `/en` |
| 韩语 | `/ko` |

这样服务端渲染出来的 HTML 就是该语言的文案，爬虫不执行 JS 也能读到正确内容；四种语言各自可被收录。

- `lib/i18n.ts` — 语言类型、`localeMeta`（原生名 / 缩写 / html lang）、`localePath()`、`L()` 构造器
- `lib/content.ts` — 所有文案都是 `L(中文, English, ລາວ, 한국어)` 形式的四语对象
- `app/page.tsx` / `app/[locale]/page.tsx` — 两个入口，各自输出该语言的 metadata
- `components/page-shell.tsx` — 把路由语言注入 Provider，并输出对应的 JSON-LD
- `components/locale-provider.tsx` — 语言上下文；`setLocale` 改为跳转到对应语言的 URL
- `components/language-switcher.tsx` — 使用真实 `<a href>` 互链，可被爬取、可中键新开

字体随语言自动切换：`[data-locale="lo"]` 用 `--font-lao`，`[data-locale="ko"]` 用 `--font-ko`。
该属性服务端就写在语言包裹层上，因此无 JS 时字体也正确。

`/zh` 会在 `next.config.ts` 里 301 到 `/`，避免出现重复页面。

新增语言：在 `lib/i18n.ts` 的 `locales` 与 `localeMeta` 中加一项，给 `L()` 增加对应参数，
再在 `lib/seo.ts` 的 `seoCopy` 里补一份标题与描述即可。

## SEO 与 GEO

### 站点地址

所有绝对地址（canonical、hreflang、sitemap、robots、Open Graph、JSON-LD）都来自
`NEXT_PUBLIC_SITE_URL`，未配置时回退到 `https://etvc-website.vercel.app`。
**绑定自定义域名后只需在 Vercel 环境变量里改这一条，不用动代码。**

### 文件一览

| 文件 | 作用 |
| --- | --- |
| `lib/seo.ts` | 中枢：站点地址、多语言路径、`buildMetadata()`、`buildJsonLd()` |
| `app/robots.ts` | 放行 GPTBot / ClaudeBot / PerplexityBot 等 17 个 AI 爬虫，声明 sitemap |
| `app/sitemap.ts` | 四条语言 URL，互相声明 hreflang，并附图片条目 |
| `app/manifest.ts` | PWA manifest |
| `app/not-found.tsx` | 站内 404 页面 |
| `middleware.ts` | 未知路径直接返回真 404（见下方「软 404」） |
| `public/llms.txt` | 给 AI 助手的站点事实摘要（GEO） |

### 结构化数据

每页输出一张 `@graph`，包含 5 个节点，`inLanguage` 随语言变化：

- `CollegeOrUniversity` + `EducationalOrganization` —— 校名四语、创办年份、合作方、地址、电话、服务地区
- `WebSite` —— 站点级信息
- `WebPage` —— 当前页面
- `Course` —— 三年制课程，含三档 `Offer`（学费 6,300,000 / 6,930,000 / 7,245,000 LAK）
- `FAQPage` —— 6 组问答

学费、名额、电话都从 `lib/content.ts` 读取，改文案即同步，不会出现两处数字打架。

### FAQ 区块

页面新增「常见问题」版块，用原生 `<details>` 折叠 —— 不依赖 JS，正文始终在 DOM 里，
AI 抓取时能直接读到问答对。它同时是 `FAQPage` 结构化数据的来源，两边永远一致。

### 关于「软 404」

项目启用了 `cacheComponents`（PPR）。`[locale]` 兜底路由在**某个未知路径第一次被访问**时，
会先返回 200 的静态壳再流式输出 404 内容，也就是软 404。
因此 `middleware.ts` 在路由层校验第一段路径，只放行四种已知语言，其余直接返回 404。


## AI 智能客服（Google Gemini）

右下角悬浮的招生咨询助手，四语界面、流式输出、快捷提问。

### 配置（3 步）

1. 打开 <https://aistudio.google.com/apikey>，创建一个 API Key（免费额度即可测试）。
2. 在项目根目录的 `.env.local` 里填入：

```bash
GEMINI_API_KEY=你的key
GEMINI_MODEL=gemini-2.5-flash        # 可选，默认就是这个
# GEMINI_ENDPOINT=...                # 可选，走代理网关时填完整 URL
```

3. 重启 `npm run dev`（或重新部署）。**改环境变量必须重启**，Next 不会热更新它。

未配置 Key 时站点照常运行，只有聊天接口返回 503，前端显示「暂时无法连接」。

### 数据同步机制

客服回答的事实**全部来自 `lib/content.ts`**，不是另写一份知识库：

```
lib/content.ts  ──import──>  lib/knowledge.ts  ──>  System Prompt  ──>  Gemini
（唯一数据源）                （渲染成事实清单）      （每次请求实时生成）
```

- `lib/knowledge.ts` 的 `buildKnowledgeBase()` 把校名、建校背景、三大使命、课程、学费表、报名流程、奖学金名额、地址、电话、WhatsApp 链接等渲染成结构化事实清单；
- 它**不写死任何数字**——学费从 `admissions.rows` 读、名额从 `welfare.quota` 读、电话从 `contact.phones` 读，所以改 `content.ts` 后下一次对话立即生效，无需重启；
- 只有在 `content.ts` 里**新增字段**时，才需要去 `lib/knowledge.ts` 补一行渲染。

事实清单约 3,900 字符（≈1,800 tokens），每次请求都带上，换来的是回答不会和官网数据打架。

### 实现要点

| 文件 | 职责 |
| --- | --- |
| `lib/knowledge.ts` | 把 `content.ts` 渲染成 System Prompt；含角色设定、语言规则、事实规则、表达规则 |
| `app/api/chat/route.ts` | `POST /api/chat`：校验入参 → 限流 → 调 Gemini SSE → 解析成纯文本流返回 |
| `components/chat-widget.tsx` | 右下角悬浮窗：消息气泡、流式追加、快捷提问、无障碍 |
| `lib/content.ts` → `chat` | 客服界面文案与 4 个快捷问题（四语） |

- **语言**：System Prompt 要求「用户用哪种语言提问就用哪种回答」，并附四语专有名词对照表，避免模型把老挝语校名音译走样；界面文案跟随站点语言。
- **流式**：后端用 `streamGenerateContent?alt=sse`，逐块解析 `data:` 行后以 `text/plain` 转发，前端 `ReadableStream` 逐块追加，形成打字机效果。
- **限流**：内存计数，每 IP 每分钟 12 次（多实例部署各自计数，够用即可）。单次最多 12 轮对话、单条 800 字。
- **成本控制**：`gemini-2.5-flash` 默认开启「思考」，首字延迟 2–5 秒，代码里对 flash 模型设了 `thinkingBudget: 0` 关掉。
- **输出格式**：Prompt 里禁止 Markdown，模型直接输出纯文本段落 + 换行，前端用 `whitespace-pre-wrap` 渲染，不会出现 `**` 之类的符号。

### 排查

| 现象 | 原因 |
| --- | --- |
| 前端提示「暂时无法连接」 | 看浏览器控制台与服务端日志，接口会把具体原因打在 `console.error` |
| 接口返回「Gemini API Key 无效」 | `.env.local` 没填、填错，或改完没重启 |
| 接口返回「模型 xxx 不存在」 | `GEMINI_MODEL` 写错，删掉该变量用默认值 |
| 返回 429 | 触发了本地限流（每 IP 每分钟 12 次），等一分钟 |
| 回答里出现官网上没有的信息 | 说明 `content.ts` 缺这块数据，补上即可；Prompt 已要求「没有就说不知道」 |

## 目录结构

```
app/
  layout.tsx        根布局：站点元信息（SEO / Open Graph / JSON-LD）、全局样式、挂载客服组件
  page.tsx          首页：按版块组合各 Section（客户端组件，读取语言上下文）
  sitemap.ts        站点地图
  globals.css       设计令牌（配色 / 字体 / 动效）、纹样底纹、滚动淡入
  api/chat/route.ts AI 客服接口：注入学校数据、转发 Gemini 流
components/
  site-header.tsx       顶部信息条 + 吸顶导航 + 移动端菜单
  language-switcher.tsx 四语切换器（桌面下拉 / 移动端按钮组）
  locale-provider.tsx   语言上下文与持久化
  hero.tsx              首屏：主视觉、标题、数据卡、公告跑马灯
  gallery.tsx           图片长廊网格 + Lightbox 灯箱
  chat-widget.tsx       AI 客服悬浮窗
  site-footer.tsx       页脚：校名、联系方式、站点导航
  reveal.tsx            滚动进入视口淡入（IntersectionObserver）
  icons.tsx             内联 SVG 图标集
lib/
  i18n.ts           语言定义与四语文案构造器
  content.ts        全站文案与数据（四语）—— 唯一数据源
  knowledge.ts      把 content.ts 渲染成 AI 客服的 System Prompt
public/images/      首页配图与报名二维码
```

## 内容维护

**改文案只需要动 `lib/content.ts`**，组件不写死任何文字。所有字符串都是四语对象，主要导出：

- `school` — 校名、副标、标语、建校年份、合作单位
- `navItems` / `ui` — 导航项与按钮、提示等通用文案
- `hero` / `heroStats` / `announcement` / `tickerItems` — 首屏与招生公告
- `about` — 建校沿革两段、基本信息表、三大使命（`missions`）
- `academics` — 学制、授课时间与五门核心课程
- `admissions` — 报名三步、五项材料、学费表（`rows` 增删行即同步表格与合计）
- `gallery` — 图片长廊（每张含四语 `alt`，增删条目自动调整网格与计数）
- `welfare` — 奖学金名额（`quota`，AI 客服也读这个字段）、三类奖项、校方海报
- `contact` — 地址（分语言分行）、三个电话、Facebook、报名二维码
- `footer` — 页脚三列链接与招生提示
- `chat` — AI 客服的界面文案与 4 个快捷问题

> 改 `content.ts` 时 AI 客服会同步更新（`lib/knowledge.ts` 每次请求实时读取），**不需要重启**。

## 设计说明

- **配色**：松柏青 `#0d3b35`（主色）+ 朱砂 `#b84a2b`（强调）+ 宣纸 `#f8f5ef`（底色）+ 金 `#c3a05c`（点缀），色值集中定义在 `app/globals.css` 的 `@theme` 中。
- **字体**：中文标题衬线（Noto Serif SC / Songti SC），正文无衬线系统字体栈；老挝语使用 `--font-lao`（Noto Sans Lao / Phetsarath OT / DokChampa / Leelawadee UI），韩语使用 `--font-ko`（Pretendard / Apple SD Gothic Neo / Malgun Gothic / Noto Sans KR），均不依赖外部字体 CDN。
- **纹样**：`.pattern-lattice` 用重复线性渐变生成民族几何菱格底纹，不额外引入图片。
- **动效**：滚动淡入依赖 `.js` 类，JS 不可用时内容直接可见，不会白屏；语言切换用 140ms 压暗再换文案，避免文字硬切。
- **响应式**：断点 390 / 768 / 1024 / 1280，学费表在窄屏自动压缩字号，不出现横向滚动；英文与老挝语校名较长，页眉会自动缩小字号并换行。
- **SEO**：每张图片都有与当前语言同步的 `alt`，页面带 JSON-LD（`CollegeOrUniversity`）、Open Graph 多语言 `alternateLocale`、`sitemap.xml`。

## 图片素材

以下图片均从校方文档 `Ethnic Technical and Vocational College (ETVC).docx` 中提取（`public/images/`）：

| 文件 | 用途 | 来源说明 |
| --- | --- | --- |
| `logo.png` | 页眉 / 页脚 / 站点图标 | 官方校徽，保留透明通道 |
| `campus-hero.jpg` | 首屏主视觉、图片长廊 | 校园建筑航拍 |
| `campus-group.jpg` | 关于我们 | 师生合影（已裁掉左上角他校水印） |
| `classroom.jpg` | 图片长廊 | 课堂实拍 |
| `students-sports.jpg` | 图片长廊 | 学生球赛 |
| `gallery-songkran.jpg` | 图片长廊 | 泼水节活动（原图 206px，已放大锐化） |
| `gallery-kayaking.jpg` | 图片长廊 | 皮划艇拓展（原图 206px，已放大锐化） |
| `gallery-trip.jpg` | 图片长廊 | 校外研学（原图 206px，已放大锐化） |
| `qr-register.png` | 联系我们 · 报名二维码 | 校方文档中的报名表二维码，指向 `forms.gle/6QwPsjyHWAd4qcqq9` |

替换方式：把新图放进 `public/images/`，保持文件名不变即可，无需改代码。

## 待确认项

- 合影原图左上角带有 `Vientiane International College` 水印，已裁切处理；若该照片实际属于其他院校，请替换。
- 图片长廊中泼水节 / 皮划艇 / 研学三张照片原图仅 206×206 px，放大后细节偏软，建议用原始高清照片覆盖同名文件。
- 报名二维码指向 Google 表单，若改用其他报名渠道，替换 `contact.qr.href` 与 `qr-register.png` 即可。
- 文档中另有 1 张他校奖学金典礼照、1 张老挝语奖学金政策海报，因含他校标识或为宣传图，未用于页面。
- 页脚「本站为演示站点」提示在接入正式内容后可删除。
