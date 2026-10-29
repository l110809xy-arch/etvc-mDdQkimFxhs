"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";

/** 标记 / 取消「已处理」 */
export async function setLeadHandled(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "1";
  if (!id) return;

  await adminClient()
    .from("leads")
    .update({ handled, handled_at: handled ? new Date().toISOString() : null })
    .eq("id", id);

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteLead(formData: FormData) {
  const admin = await requireAdmin();
  if (admin.role !== "admin") return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await adminClient().from("leads").delete().eq("id", id);

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}
