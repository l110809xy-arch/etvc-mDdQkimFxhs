import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdmin } from "@/lib/admin-auth";

// 后台必须运行时渲染（读 cookie 判登录），不能静态预渲染
export const instant = false;


export const metadata: Metadata = {
  title: "后台登录 | ETVC",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // 已登录就直接进后台
  const admin = await getAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <p className="text-[10.5px] tracking-[0.3em] text-cinnabar">ETVC ADMIN</p>
        <h1 className="mt-3 font-serif text-[26px] leading-tight text-pine">
          民族职业技术学院
          <br />
          内容管理后台
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
          仅限招生办与校方管理人员使用。
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-[11.5px] text-ink-soft/60">
          <Link href="/" className="hover:text-pine">
            ← 返回网站首页
          </Link>
        </p>
      </div>
    </main>
  );
}
