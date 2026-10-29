/**
 * 后台鉴权
 *
 * 流程：Supabase Auth 会话（cookie）→ 查 admins 白名单 → 才算管理员。
 * 光有账号不够，必须在白名单里，避免注册用户混进后台。
 */

import { redirect } from "next/navigation";
import { adminClient, hasSupabase } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
};

export async function getAdmin(): Promise<AdminUser | null> {
  if (!hasSupabase) return null;

  const user = await getSessionUser();
  if (!user) return null;

  const { data } = await adminClient()
    .from("admins")
    .select("user_id, email, name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.user_id as string,
    email: (data.email as string) || user.email || "",
    name: (data.name as string) || "",
    role: (data.role as "admin" | "viewer") ?? "admin",
  };
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
