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

## 多语言（四语切换）

支持 **老挝语 / 中文 / 英文 / 韩语** 四种语言，导航右侧的下拉菜单即时切换，无需刷新页面。

- `lib/i18n.ts` — 语言类型、语言元数据（原生名 / 英文名 / 缩写 / html lang）、`L()` 构造器
- `lib/content.ts` — 所有文案都是 `L(中文, English, ລາວ, 한국어)` 形式的四语对象
- `components/locale-provider.tsx` — 语言上下文：`locale` / `setLocale` / `t()`；写入 `localStorage`，同步 `<html lang>` 与 `data-locale`，切换时做 140ms 交叉淡入
- `components/language-switcher.tsx` — 桌面下拉菜单 + 移动端抽屉内的四语按钮组

字体随语言自动切换：`html[data-locale="lo"]` 用 `--font-lao`，`html[data-locale="ko"]` 用 `--font-ko`，中文与英文沿用默认字体栈。

新增语言：在 `lib/i18n.ts` 的 `locales` 与 `localeMeta` 中加一项，并给 `L()` 增加对应参数即可。

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
