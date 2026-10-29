/**
 * Supabase 服务端会话客户端（anon key + cookie）
 *
 * 只用来读当前登录用户、校验身份。数据读写一律走 adminClient()。
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

export const hasSupabaseAuth = Boolean(URL && ANON_KEY);

export async function createSupabaseServerClient() {
  if (!hasSupabaseAuth) return null;

  const cookieStore = await cookies();

  return createServerClient(URL, ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // 在 Server Component 里调用 set 会抛错，忽略即可
        }
      },
    },
  });
}

/** 取当前登录用户，未登录返回 null */
export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
