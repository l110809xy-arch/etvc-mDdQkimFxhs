/**
 * 文章 slug 清单（只有字符串，不含正文）。
 *
 * 单独放一个文件是为了给 middleware 用：中间件要在路由层判定
 * 「/blog/xxx 到底存不存在」，如果直接 import lib/articles.ts，
 * 整套四语正文都会被打进边缘函数，体积和冷启动都吃亏。
 *
 * ⚠️ 新增文章时，这里和 lib/articles.ts 必须同时更新。
 *    articles.ts 在模块加载时会做一致性校验，漏改会直接构建失败，
 *    不会出现「页面存在但被中间件 404」这种线上才发现的问题。
 */
export const ARTICLE_SLUGS = [
  "etvc-tuition",
  "etvc-scholarships",
  "how-to-apply-etvc",
  "business-chinese-in-laos",
] as const;

export type ArticleSlug = (typeof ARTICLE_SLUGS)[number];

export const ARTICLE_SLUG_SET: ReadonlySet<string> = new Set(ARTICLE_SLUGS);
