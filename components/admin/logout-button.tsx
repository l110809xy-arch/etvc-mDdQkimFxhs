"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    try {
      await browserClient().auth.signOut();
    } catch {
      // 忽略：即使接口失败也回登录页
    }
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-[12px] text-ink-soft/70 transition-colors hover:text-cinnabar disabled:opacity-50"
    >
      {pending ? "退出中…" : "退出登录"}
    </button>
  );
}
