"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";

const STATUSES = ["pending", "reviewing", "accepted", "rejected", "enrolled"] as const;

export async function updateStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 300);

  if (!id || !STATUSES.includes(status as (typeof STATUSES)[number])) return;

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
}

export async function deleteApplication(formData: FormData) {
  const admin = await requireAdmin();
  if (admin.role !== "admin") return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await adminClient().from("applications").delete().eq("id", id);

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
}
