"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";

/** 操作后回到原筛选条件并带提示参数；redirect 保证页面一定重新渲染 */
function backTo(formData: FormData, msg: string) {
  const filter = String(formData.get("back") ?? "").trim() || "open";
  return `/admin/leads?filter=${filter}&msg=${msg}`;
}

/** 标记 / 取消「已处理」 */
export async function setLeadHandled(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "1";
  if (!id) redirect(backTo(formData, "invalid"));

  const { error } = await adminClient()
    .from("leads")
    .update({ handled, handled_at: handled ? new Date().toISOString() : null })
    .eq("id", id);

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect(backTo(formData, error ? "failed" : handled ? "handled" : "reopened"));
}

export async function deleteLead(formData: FormData) {
  const admin = await requireAdmin();
  if (admin.role !== "admin") redirect(backTo(formData, "denied"));

  const id = String(formData.get("id") ?? "");
  if (!id) redirect(backTo(formData, "invalid"));

  const { error } = await adminClient().from("leads").delete().eq("id", id);

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect(backTo(formData, error ? "failed" : "deleted"));
}
