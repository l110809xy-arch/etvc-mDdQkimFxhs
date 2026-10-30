"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { editableFields } from "@/lib/editable";
import { locales } from "@/lib/i18n";
import { adminClient } from "@/lib/supabase/admin";

/** 保存后让静态页面重新生成（四种语言都要刷） */
function refreshSite() {
  updateTag("content");
  for (const path of ["/", "/lo", "/en", "/ko"]) revalidatePath(path);
  revalidatePath("/admin/content");
}

export async function saveContent(formData: FormData) {
  await requireAdmin();

  const key = String(formData.get("key") ?? "");
  const field = editableFields.find((f) => f.key === key);
  if (!field) return;

  const db = adminClient();
  const touched: string[] = [];

  for (const locale of locales) {
    const raw = formData.get(`v_${locale}`);
    if (raw === null) continue;

    const value = String(raw).trim();
    const fallback = field.value[locale].trim();

    if (!value || value === fallback) {
      // 和默认值一致 → 删掉覆盖，回到代码里的文案
      await db.from("content_overrides").delete().eq("key", key).eq("locale", locale);
      touched.push(`${locale}:默认`);
    } else {
      await db.from("content_overrides").upsert(
        { key, locale, value, updated_at: new Date().toISOString() },
        { onConflict: "key,locale" },
      );
      touched.push(`${locale}:自定义`);
    }
  }

  console.log(`[content] ${key} 保存 → ${touched.join(", ")}`);
  refreshSite();
}

/** 一键清除某字段的所有语言覆盖 */
export async function resetContent(formData: FormData) {
  await requireAdmin();

  const key = String(formData.get("key") ?? "");
  if (!editableFields.some((f) => f.key === key)) return;

  await adminClient().from("content_overrides").delete().eq("key", key);
  refreshSite();
}
