import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  /**
   * 中文占用根路径，/zh 只是历史遗留的猜测式地址。
   * 在这里做 301 而不是在页面里判 404：PPR 流式渲染会让页面内的 notFound()
   * 返回 200 + 404 内容（软 404），静态重定向能给出真正的 301。
   */
  async redirects() {
    return [
      { source: "/zh", destination: "/", permanent: true },
      { source: "/zh/:path*", destination: "/:path*", permanent: true },
    ];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  /**
   * 基础安全响应头。
   *
   * CSP 说明：Next 的启动脚本是内联的，用 nonce 方案需要 middleware 动态生成，
   * 会让全站失去静态化。这里退一步用 'unsafe-inline'，仍然能挡住
   * 外域脚本、外域连接、base-uri / form-action 劫持和内嵌框架，属于净收益。
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
