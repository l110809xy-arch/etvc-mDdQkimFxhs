import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * 显式放行主流 AI 爬虫。
 * GEO（生成式引擎优化）的前提是被抓取：ChatGPT、Claude、Perplexity、Google AI
 * 都遵循各自 user-agent 的 robots 规则，不点名就可能被默认策略挡住。
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "Meta-ExternalAgent",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 接口不参与索引，但保留抓取以免影响正常访问
        disallow: ["/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
