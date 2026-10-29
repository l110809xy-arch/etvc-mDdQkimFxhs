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
};

export default nextConfig;
