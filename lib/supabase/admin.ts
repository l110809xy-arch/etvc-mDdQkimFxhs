/**
 * Supabase 服务端管理客户端（service_role）
 *
 * ⚠️ 只在服务端使用：route handler / server component / server action。
 * 这个密钥能绕过 RLS，绝不能出现在浏览器里。
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

/** 是否配置了数据库。未配置时接口返回 503，页面照常展示。 */
export const hasSupabase = Boolean(URL && SERVICE_KEY);

let cached: SupabaseClient | null = null;

export function adminClient(): SupabaseClient {
  if (!hasSupabase) {
    throw new Error(
      "Supabase 未配置：缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  if (!cached) {
    cached = createClient(URL, SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "X-Client-Info": "etvc-website/admin" } },
    });
  }
  return cached;
}

/** 把 IP 变成不可逆短哈希，用于限流与防刷，不存原始 IP */
export function hashIp(ip: string): string {
  let h = 2166136261;
  for (let i = 0; i < ip.length; i += 1) {
    h ^= ip.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36).padStart(7, "0");
}
