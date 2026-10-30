"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "概览", exact: true },
  { href: "/admin/applications", label: "报名管理" },
  { href: "/admin/leads", label: "留言咨询" },
  { href: "/admin/content", label: "内容编辑" },
  { href: "/admin/chats", label: "客服对话" },
  { href: "/admin/security", label: "账号安全" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2.5 text-[13.5px] transition-colors ${
              active
                ? "bg-pine text-paper"
                : "text-ink/75 hover:bg-paper-2 hover:text-pine"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
