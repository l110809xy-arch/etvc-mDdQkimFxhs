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

export type SessionUser = {
  id: string;
  email: string;
  appMetadata: Record<string, unknown>;
};

/**
 * 取当前登录用户，未登录返回 null。
 *
 * 优先用 getClaims()：项目已启用 ES256 非对称签名，JWKS 公钥会被缓存，
 * 验签在本地完成，不产生网络请求。原来的 getUser() 每次都要打一次
 * Supabase Auth 接口，在跨区域访问时单次就要 300–700ms，
 * 而后台每次切页都会走这条路，是「菜单点下去要等两秒」的主因之一。
 *
 * 若项目仍在使用旧的 HS256 密钥，getClaims() 会返回错误，
 * 此时自动回退到 getUser()，行为与之前完全一致。
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims as Record<string, unknown> | undefined;
    if (!error && claims && typeof claims.sub === "string") {
      return {
        id: claims.sub,
        email: typeof claims.email === "string" ? claims.email : "",
        appMetadata: (claims.app_metadata as Record<string, unknown>) ?? {},
      };
    }
  } catch {
    // getClaims 不可用时继续走下面的回退路径
  }

  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    appMetadata: (data.user.app_metadata as Record<string, unknown>) ?? {},
  };
}
