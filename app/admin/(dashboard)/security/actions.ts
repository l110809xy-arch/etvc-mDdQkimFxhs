"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** 后台自助改密码：默认密码写在文档里过，上线后第一件事就该换掉 */
export async function changePassword(formData: FormData) {
  await requireAdmin();

  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 10) redirect("/admin/security?err=short");
  if (next !== confirm) redirect("/admin/security?err=mismatch");

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/security?err=offline");

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) redirect("/admin/security?err=failed");

  redirect("/admin/security?ok=1");
}
