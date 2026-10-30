import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found-view";

export const metadata: Metadata = {
  title: "页面不存在 404 | 民族职业技术学院 ETVC",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundView />;
}
