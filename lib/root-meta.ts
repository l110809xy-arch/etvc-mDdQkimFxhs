import type { Metadata, Viewport } from "next";
import { SITE_URL } from "./seo";

/**
 * 三个根布局共用的基础元信息。
 *
 * 拆成 route group 之后不再有 app/layout.tsx，metadataBase / icons / viewport
 * 必须在每个根布局里各自声明，因此集中在这里，避免三处各写一份走样。
 */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d3b35",
  colorScheme: "light",
};
