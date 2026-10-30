"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";

const STATUSES = ["pending", "reviewing", "accepted", "rejected", "enrolled"] as const;

/**
 * 操作完成后 redirect 回原筛选条件，并带上提示参数。
 * 用 redirect 而不是只 revalidatePath：服务端动作结束后页面一定会重新渲染，
 * 否则在 PPR 下偶尔会出现「点了没反应」的错觉。
 */
function backTo(formData: FormData, msg: string) {
  const back = String(formData.get("back") ?? "").trim();
  return `/admin/applications?${back ? `${back}&` : ""}msg=${msg}`;
}

export async function updateStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 300);

  if (!id || !STATUSES.includes(status as (typeof STATUSES)[number])) {
    redirect(backTo(formData, "invalid"));
  }

  await adminClient()
    .from("applications")
    .update({
      status,
      status_note: note || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
    })
    .eq("id", id);

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  redirect(backTo(formData, "saved"));
}

export async function deleteApplication(formData: FormData) {
  const admin = await requireAdmin();
  if (admin.role !== "admin") redirect(backTo(formData, "denied"));

  const id = String(formData.get("id") ?? "");
  if (!id) redirect(backTo(formData, "invalid"));

  const { error } = await adminClient().from("applications").delete().eq("id", id);

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
  redirect(backTo(formData, error ? "failed" : "deleted"));
}
