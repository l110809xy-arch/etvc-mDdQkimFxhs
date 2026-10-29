import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "管理后台 | ETVC",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-paper-2/40">
      <div className="mx-auto flex max-w-[1240px] flex-col lg:flex-row">
        {/* 侧栏 */}
        <aside className="border-b border-pine/10 bg-paper lg:min-h-screen lg:w-56 lg:shrink-0 lg:border-r lg:border-b-0">
          <div className="px-5 py-6">
            <Link href="/admin" className="block">
              <p className="text-[9.5px] tracking-[0.28em] text-cinnabar">ETVC ADMIN</p>
              <p className="mt-1.5 font-serif text-[16px] leading-snug text-pine">
                民族职业技术学院
              </p>
            </Link>
          </div>

          <div className="px-2 pb-4">
            <AdminNav />
          </div>

          <div className="mt-auto space-y-2 border-t border-pine/10 px-5 py-4">
            <p className="truncate text-[11.5px] text-ink-soft/70">{admin.email}</p>
            <div className="flex items-center gap-3">
              <LogoutButton />
              <Link href="/" className="text-[12px] text-ink-soft/70 hover:text-pine">
                看网站
              </Link>
            </div>
          </div>
        </aside>

        {/* 内容区 */}
        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
