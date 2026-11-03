/**
 * 后台鉴权
 *
 * 流程：Supabase Auth 会话（cookie）→ 查 admins 白名单 → 才算管理员。
 * 光有账号不够，必须在白名单里，避免注册用户混进后台。
 */

import { cache } from "react";
import { redirect } from "next/navigation";
import { adminClient, hasSupabase } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
};

/**
 * 后台布局和页面都会调用 requireAdmin()，原来每次导航要跑两遍
 * 「验 session → 查 admins 白名单」共 4 次 Supabase 往返。
 * 用 React cache() 包一层，同一次请求内只查一次，后一次直接命中缓存。
 *
 * 另外：管理员创建时会把 role 写进 app_metadata（只有 service_role 能写，
 * 客户端改不了，所以可信）。命中这条时完全不用查库，
 * 后台切页只剩「页面自己那一次查询」的耗时。
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  if (!hasSupabase) return null;

  const user = await getSessionUser();
  if (!user) return null;

  const claimedRole = user.appMetadata?.role;
  if (claimedRole === "admin" || claimedRole === "viewer") {
    return {
      id: user.id,
      email: user.email,
      name: typeof user.appMetadata.name === "string" ? user.appMetadata.name : "",
      role: claimedRole,
    };
  }

  // 兼容老账号：app_metadata 里还没有 role 时，回落到白名单表
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
});

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
