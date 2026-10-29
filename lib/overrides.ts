/**
 * 文案覆盖读取
 *
 * 站点默认文案在 lib/content.ts（随代码走），后台改过的只存差异。
 * 用 "use cache" 缓存结果，后台保存后调 revalidateTag("content") 立即失效，
 * 这样首页仍是静态预渲染，又不需要重新部署就能更新文案。
 */

import { cacheTag } from "next/cache";
import { adminClient, hasSupabase } from "./supabase/admin";

export type OverrideMap = Record<string, string>;

/** key 形如 announcement.text|lo */
export const overrideKey = (key: string, locale: string) => `${key}|${locale}`;

export async function loadOverrides(): Promise<OverrideMap> {
  "use cache";
  cacheTag("content");

  if (!hasSupabase) return {};

  try {
    const { data } = await adminClient().from("content_overrides").select("key, locale, value");
    const map: OverrideMap = {};
    for (const row of (data ?? []) as { key: string; locale: string; value: string }[]) {
      map[overrideKey(row.key, row.locale)] = row.value;
    }
    return map;
  } catch {
    // 数据库不可用时退回默认文案，页面照常展示
    return {};
  }
}
