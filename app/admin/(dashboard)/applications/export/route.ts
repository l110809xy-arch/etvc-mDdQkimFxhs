/**
 * 导出报名数据为 CSV
 * 带 UTF-8 BOM，Excel 直接双击打开中文不乱码。
 */

import { getAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";

const HEADERS = [
  ["created_at", "提交时间"],
  ["full_name", "姓名"],
  ["phone", "电话"],
  ["gender", "性别"],
  ["birth_date", "出生日期"],
  ["province", "住址"],
  ["high_school", "毕业学校"],
  ["grad_year", "毕业年份"],
  ["gpa", "毕业成绩"],
  ["scholarship", "申请奖学金"],
  ["status", "状态"],
  ["status_note", "审核备注"],
  ["note", "学生备注"],
  ["locale", "提交语言"],
] as const;

const STATUS_LABEL: Record<string, string> = {
  pending: "待审核",
  reviewing: "审核中",
  accepted: "已录取",
  rejected: "未录取",
  enrolled: "已入学",
};

/** CSV 转义：含逗号/引号/换行时用双引号包裹，内部引号翻倍 */
function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = String(value);
  if (typeof value === "boolean") text = value ? "是" : "否";
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export async function GET() {
  const admin = await getAdmin();
  if (!admin) {
    return new Response("未登录", { status: 401 });
  }

  const { data, error } = await adminClient()
    .from("applications")
    .select(HEADERS.map(([key]) => key).join(", "))
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(`导出失败：${error.message}`, { status: 500 });
  }

  const rows = (data ?? []) as unknown as Record<string, unknown>[];

  const lines = [
    HEADERS.map(([, label]) => label).join(","),
    ...rows.map((row) =>
      HEADERS.map(([key]) => {
        if (key === "status") return cell(STATUS_LABEL[String(row[key])] ?? row[key]);
        if (key === "gender") {
          const g = String(row[key] ?? "");
          return cell(g === "male" ? "男" : g === "female" ? "女" : g === "other" ? "未说明" : "");
        }
        return cell(row[key]);
      }).join(","),
    ),
  ];

  const csv = "\uFEFF" + lines.join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="etvc-applications-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
