/**
 * Supabase 浏览器客户端（anon key）
 * 只用于登录表单，业务数据不从这里读。
 */

"use client";

import { createBrowserClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function browserClient() {
  if (!URL || !ANON_KEY) {
    throw new Error("Supabase 未配置：缺少 NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  if (!cached) cached = createBrowserClient(URL, ANON_KEY);
  return cached;
}
